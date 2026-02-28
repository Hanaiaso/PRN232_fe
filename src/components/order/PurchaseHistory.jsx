import { useState, useEffect } from "react";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";
import OrderList from "./OrderList";
import BuyerReturnRequestList from "./BuyerReturnRequestList";
import { getAccessToken } from '@/api/token';
import './PurchaseHistory.scss';

export default function PurchaseHistory() {
  const [activeTab, setActiveTab] = useState("All Purchases");
  const [searchValue, setSearchValue] = useState("");
  const [activeNav, setActiveNav] = useState("Purchases");
  const [orders, setOrders] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeNav === "Purchases") {
      fetchOrders();
    } else if (activeNav === "Return Requests") {
      fetchReturnRequests();
    }
  }, [activeNav]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      const response = await fetch('https://localhost:49547/api/Order/history', {
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
        setOrders(result.data.items);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReturnRequests = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      const response = await fetch('https://localhost:49547/api/ReturnRequest/buyer', {
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

  const filteredOrders = orders.filter(order => {
    if (activeTab === "All Purchases") return true;
    if (activeTab === "Processing") return order.status === "PROCESSING";
    if (activeTab === "Returns & Canceled") return order.status === "CANCELLED";
    return true;
  });

  return (
    <main className="content">
      <div className="purchase-history">
        <TopNav />

        <div className="purchase-history-body">
          <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

          <div className="purchase-history-main">
            <div className="purchase-history-header">
              <h1>Purchases</h1>
              <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
            </div>

            {activeNav === "Purchases" ? (
              <>
                <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="purchase-history-orders-header">
                  <h2>Orders</h2>
                  <div className="purchase-history-filter">
                    See orders:{" "}
                    <select>
                      <option>All</option>
                      <option>Last 30 days</option>
                      <option>Last 60 days</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="purchase-history-empty">Loading orders...</div>
                ) : !orders || orders.length === 0 ? (
                  <div className="purchase-history-empty">No orders were found</div>
                ) : (
                  <OrderList orders={filteredOrders} />
                )}
              </>
            ) : activeNav === "Return Requests" ? (
              loading ? (
                <div className="purchase-history-empty">Loading return requests...</div>
              ) : (
                <BuyerReturnRequestList requests={returnRequests} onRefresh={fetchReturnRequests} />
              )
            ) : (
              <div className="purchase-history-empty">Select an option from the sidebar</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
