import { useEffect, useState } from "react";

const STORAGE_KEY = "daily-goals-events";

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default function Events() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getToday());
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("30");
  const [location, setLocation] = useState("");
  const [reminder, setReminder] = useState("10");
  const [important, setImportant] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(events)
    );
  }, [events]);

  function addEvent(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter an event name.");
      return;
    }

    const newEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      time,
      duration: Number(duration),
      location,
      reminder: Number(reminder),
      important,
    };

    setEvents((current) => [...current, newEvent]);

    setTitle("");
    setLocation("");
    setDuration("30");
    setReminder("10");
    setImportant(false);
  }

  function deleteEvent(id) {
    setEvents((current) =>
      current.filter((event) => event.id !== id)
    );
  }

  const sortedEvents = [...events].sort((a, b) => {
    const first = `${a.date} ${a.time}`;
    const second = `${b.date} ${b.time}`;

    return first.localeCompare(second);
  });

  return (
    <div className="events-page">

      <div className="page-heading">

        <div>
          <div className="eyebrow">
            CALENDAR & REMINDERS
          </div>

          <h1>Meetings & Events</h1>

          <p>
            Never miss something important.
          </p>
        </div>

        <div className="event-count">
          <strong>{events.length}</strong>
          <span>Events</span>
        </div>

      </div>

      {/* CREATE EVENT */}

      <section className="event-form-card">

        <div className="section-title">
          <div>
            <h2>Add Important Event</h2>
            <p>
              Schedule a meeting, appointment or reminder.
            </p>
          </div>

          <div className="calendar-icon">
            📅
          </div>
        </div>

        <form
          className="event-form"
          onSubmit={addEvent}
        >

          <div className="form-group event-title">
            <label>Event name</label>

            <input
              type="text"
              placeholder="e.g. Team meeting"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Time</label>

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Duration</label>

            <select
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
            >
              <option value="15">
                15 minutes
              </option>

              <option value="30">
                30 minutes
              </option>

              <option value="45">
                45 minutes
              </option>

              <option value="60">
                1 hour
              </option>

              <option value="90">
                1.5 hours
              </option>

              <option value="120">
                2 hours
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Reminder</label>

            <select
              value={reminder}
              onChange={(e) =>
                setReminder(e.target.value)
              }
            >
              <option value="0">
                At event time
              </option>

              <option value="5">
                5 minutes before
              </option>

              <option value="10">
                10 minutes before
              </option>

              <option value="15">
                15 minutes before
              </option>

              <option value="30">
                30 minutes before
              </option>
            </select>
          </div>

          <div className="form-group event-location">
            <label>
              Location / Meeting link
            </label>

            <input
              type="text"
              placeholder="Office, Google Meet, Zoom..."
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />
          </div>

          <label className="important-checkbox">

            <input
              type="checkbox"
              checked={important}
              onChange={(e) =>
                setImportant(e.target.checked)
              }
            />

            <span>
              ⭐ Mark as important
            </span>

          </label>

          <button
            type="submit"
            className="add-event-button"
          >
            + Add Event
          </button>

        </form>

      </section>

      {/* EVENTS */}

      <section className="events-list-card">

        <div className="events-list-heading">

          <div>
            <h2>Upcoming Events</h2>

            <p>
              Your important meetings and reminders
            </p>
          </div>

        </div>

        {sortedEvents.length === 0 ? (

          <div className="empty-events">
            <div>🗓️</div>

            <h3>No events scheduled</h3>

            <p>
              Add your first meeting or important event
              above.
            </p>
          </div>

        ) : (

          <div className="events-list">

            {sortedEvents.map((event) => (

              <div
                className={`event-item ${
                  event.important
                    ? "important-event"
                    : ""
                }`}
                key={event.id}
              >

                <div className="event-date">

                  <strong>
                    {new Date(
                      `${event.date}T00:00:00`
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                      }
                    )}
                  </strong>

                  <span>
                    {new Date(
                      `${event.date}T00:00:00`
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        month: "short",
                      }
                    )}
                  </span>

                </div>

                <div className="event-details">

                  <div className="event-title-row">

                    <h3>{event.title}</h3>

                    {event.important && (
                      <span className="important-badge">
                        ⭐ Important
                      </span>
                    )}

                  </div>

                  <div className="event-meta">

                    <span>
                      🕐 {event.time}
                    </span>

                    <span>
                      ⏱️ {event.duration} min
                    </span>

                    <span>
                      🔔 {event.reminder === 0
                        ? "At event time"
                        : `${event.reminder} min before`}
                    </span>

                    {event.location && (
                      <span>
                        📍 {event.location}
                      </span>
                    )}

                  </div>

                  <div className="event-full-date">
                    {formatDate(event.date)}
                  </div>

                </div>

                <button
                  className="delete-event"
                  onClick={() =>
                    deleteEvent(event.id)
                  }
                >
                  🗑️
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}