import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("daily-goals-user");

  const [user, setUser] = useState(
    savedUser
      ? JSON.parse(savedUser)
      : {
          name: "",
          email: "",
          avatar: "",
        }
  );

  const [editing, setEditing] = useState(false);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Limit image size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setUser((current) => ({
        ...current,
        avatar: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setUser((current) => ({
      ...current,
      avatar: "",
    }));
  }

  function handleSave() {
    localStorage.setItem(
      "daily-goals-user",
      JSON.stringify(user)
    );

    setEditing(false);
  }

  function handleLogout() {
    localStorage.removeItem("daily-goals-user");
    navigate("/login");
    window.location.reload();
  }

  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-heading">
          <div>
            <div className="eyebrow">ACCOUNT</div>
            <h1>My Profile</h1>
            <p>Manage your personal information.</p>
          </div>
        </div>

        <section className="profile-card">

          <div className="profile-cover"></div>

          <div className="profile-content">

          <div className="profile-avatar-wrapper">

        {/* Hidden file picker */}
        <input
        id="profile-photo"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        hidden
        />

        {/* Clickable profile photo */}
        <label
        htmlFor="profile-photo"
        className="profile-avatar clickable-avatar"
        title="Choose profile photo"
        >
        {user.avatar ? (
            <img
            src={user.avatar}
            alt="Profile"
            />
        ) : (
            <span>{initials}</span>
        )}

        <div className="avatar-camera-overlay">
            📷
        </div>
        </label>

            </div>

            <div className="profile-main">
              <h2>
                {user.name || "Your Name"}
              </h2>

              <p>
                {user.email || "No email added"}
              </p>
            </div>

            <button
              className="edit-profile-button"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>

          </div>

          {editing && (
            <div className="profile-form">

              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  value={user.name}
                  placeholder="Your name"
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={user.email}
                  placeholder="you@example.com"
                  onChange={(e) =>
                    setUser({
                      ...user,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* Photo Section */}
              <div className="photo-upload-section">

                <label>Profile Photo</label>

                <div className="photo-upload-actions">

                  <label
                    htmlFor="profile-photo"
                    className="choose-photo-button"
                  >
                    📷 Choose Photo
                  </label>

                  {user.avatar && (
                    <button
                      type="button"
                      className="remove-photo-button"
                      onClick={removePhoto}
                    >
                      Remove Photo
                    </button>
                  )}

                </div>

                <p className="photo-help">
                  JPG, PNG or WEBP. Maximum size 5 MB.
                </p>

              </div>

              <button
                className="save-profile-button"
                onClick={handleSave}
              >
                Save Changes
              </button>

            </div>
          )}

        </section>

        <section className="profile-settings">

          <div>
            <h3>Account</h3>
            <p>
              Manage your Daily Goals account.
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Log Out
          </button>

        </section>

      </div>
    </div>
  );
}