import { useState } from "react";
import { useProfiles } from "../context/ProfileContext";

import "./FarmerProfile.css";

function FarmerProfile() {
  const { profiles, updateProfile } = useProfiles();

  // Start the form with the saved profile
  const [form, setForm] = useState(profiles.farmer);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // One handler for every input: uses the input's name attribute
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
    setSaved(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (form.phone.trim() && !/^\d{10}$/.test(form.phone.trim())) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    updateProfile("farmer", {
      name: form.name.trim(),
      phone: form.phone.trim(),
      village: form.village.trim(),
      state: form.state.trim(),
      farmSize: form.farmSize.trim(),
    });
    setSaved(true);
  }

  return (
  <div className="farmer-profile-page">
      <h1>My Profile</h1>
      <p>Keep your farmer details up to date.</p>

      <form onSubmit={handleSubmit} className="crop-form profile-form">
        <div>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="phone">Phone (10 digits)</label>
          <input id="phone" name="phone" type="text" inputMode="numeric" maxLength={10} value={form.phone} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="village">Village / District</label>
          <input id="village" name="village" type="text" value={form.village} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="state">State</label>
          <input id="state" name="state" type="text" placeholder="e.g. Madhya Pradesh" value={form.state} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="farmSize">Farm size (acres)</label>
          <input id="farmSize" name="farmSize" type="text" value={form.farmSize} onChange={handleChange} />
        </div>

        {error && <p className="crop-error" role="alert">{error}</p>}
        {saved && <p className="profile-success" role="status">Profile saved.</p>}

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default FarmerProfile;
