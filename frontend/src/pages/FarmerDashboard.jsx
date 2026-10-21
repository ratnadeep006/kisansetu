import { useCrops } from "../context/CropContext";

import { useActivities } from "../context/ActivityContext";

import "./FarmerDashboard.css";

function FarmerDashboard() {
  // Read the shared crops list from the Context
  const { crops } = useCrops();
  const { activities } = useActivities();

  // Count crops in each season
  const kharifCount = crops.filter((crop) => crop.season === "Kharif").length;
  const rabiCount = crops.filter((crop) => crop.season === "Rabi").length;
  const zaidCount = crops.filter((crop) => crop.season === "Zaid").length;

  return (
    <div className="farmer-dashboard">
      <h1>Farmer Dashboard</h1>
      <p>Welcome to your KisanSetu farming workspace.</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>My Crops</h3>
          <p>
            {crops.length} {crops.length === 1 ? "crop" : "crops"} registered
          </p>

          {crops.length > 0 && (
            <ul className="season-summary">
              <li>Kharif: {kharifCount}</li>
              <li>Rabi: {rabiCount}</li>
              <li>Zaid: {zaidCount}</li>
            </ul>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Activities</h3>
          <p>
            {activities.length === 0
              ? "No activities yet"
              : `${activities.length} ${
                  activities.length === 1 ? "activity" : "activities"
                } recorded`}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Expert Consultations</h3>
          <p>0 pending requests</p>
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboard;
