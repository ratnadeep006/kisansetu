import { useState } from "react";
import { useProfiles } from "../context/ProfileContext";

import "./ExpertProfile.css";

function ExpertProfile() {
  const { profiles, updateProfile } = useProfiles();

  const [form, setForm] = useState(profiles.expert);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

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

    updateProfile("expert", {
      name: form.name.trim(),
      phone: form.phone.trim(),
      specialization: form.specialization.trim(),
      experience: form.experience.trim(),
    });
    setSaved(true);
  }

  return (
    <div className="crops-page">
      <h1>My Profile</h1>
      <p>Keep your expert details up to date.</p>

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
          <label htmlFor="specialization">Specialization</label>
          <input id="specialization" name="specialization" type="text" placeholder="e.g. Soil health, Crop diseases" value={form.specialization} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="experience">Experience (years)</label>
          <input id="experience" name="experience" type="text" value={form.experience} onChange={handleChange} />
        </div>

        {error && <p className="crop-error" role="alert">{error}</p>}
        {saved && <p className="profile-success" role="status">Profile saved.</p>}

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default ExpertProfile;