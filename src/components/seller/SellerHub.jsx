import { useState, useEffect } from "react";
import SellerTopNav from "./SellerTopNav";
import SellerSidebar from "./SellerSidebar";
import ReturnRequestList from "./ReturnRequestList";
import { getAccessToken } from '@/api/token';
import './SellerHub.scss';

export default function SellerHub() {
  const [activeNav, setActiveNav] = useState("All orders");
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeNav === "Return request") {
      fetchReturnRequests();
    }
  }, [activeNav]);

  const fetchReturnRequests = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      const response = await fetch('https://localhost:49547/api/ReturnRequest/seller', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        setLoading(false);
        return;
      }

      const result = await response.json();
      if (result.success && result.data && result.data.items) {
        setReturnRequests(result.data.items);
      }
    } catch (error) {
      console.error('Error fetching return requests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="content">
      <div className="seller-hub">
        <SellerTopNav />

        <div className="seller-hub-body">
          <SellerSidebar activeNav={activeNav} setActiveNav={setActiveNav} />

          <div className="seller-hub-main">
            <div className="seller-hub-header">
              <h1>Seller Hub</h1>
              <p className="seller-subtitle">Manage your selling activity</p>
            </div>

            {activeNav === "Return request" ? (
              loading ? (
                <div className="seller-hub-empty">Loading return requests...</div>
              ) : (
                <ReturnRequestList requests={returnRequests} onRefresh={fetchReturnRequests} />
              )
            ) : (
              <div className="seller-hub-empty">
                Select an option from the sidebar to get started
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
