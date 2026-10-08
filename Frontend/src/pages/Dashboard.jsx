import { useEffect, useMemo, useState } from "react";
import "../App.css";

const STORAGE_KEY = "daily-goals-tasks";

function getDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (remaining === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remaining} min`;
}

export default function Dashboard() {
  const today = getDate(0);
  const tomorrow = getDate(1);

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: crypto.randomUUID(),
        title: "Morning Exercise",
        date: today,
        startTime: "07:00",
        duration: 30,
        priority: "High",
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        title: "Read a book",
        date: today,
        startTime: "20:00",
        duration: 45,
        priority: "Medium",
        completed: false,
      },
    ];
  });

  const [newTask, setNewTask] = useState("");
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState("30");
  const [priority, setPriority] = useState("Medium");
  const [view, setView] = useState("today");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();

    if (!newTask.trim()) {
      return;
    }

    const task = {
      id: crypto.randomUUID(),
      title: newTask.trim(),
      date,
      startTime,
      duration: Number(duration),
      priority,
      completed: false,
    };

    setTasks((current) => [
      ...current,
      task,
    ]);

    setNewTask("");
    setStartTime("09:00");
    setDuration("30");
    setPriority("Medium");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) =>
      current.filter(
        (task) => task.id !== id
      )
    );
  }

  const visibleTasks = useMemo(() => {
    let result = [...tasks];

    if (view === "today") {
      result = result.filter(
        (task) => task.date === today
      );
    }

    if (view === "tomorrow") {
      result = result.filter(
        (task) => task.date === tomorrow
      );
    }

    return result.sort((a, b) =>
      a.startTime.localeCompare(
        b.startTime
      )
    );
  }, [tasks, view, today, tomorrow]);

  const totalMinutes = visibleTasks.reduce(
    (sum, task) =>
      sum + Number(task.duration),
    0
  );

  const completedMinutes = visibleTasks
    .filter((task) => task.completed)
    .reduce(
      (sum, task) =>
        sum + Number(task.duration),
      0
    );

  const completedCount =
    visibleTasks.filter(
      (task) => task.completed
    ).length;

  const progress =
    totalMinutes === 0
      ? 0
      : Math.round(
          (completedMinutes /
            totalMinutes) *
            100
        );

  return (
    <div className="app">
      <div className="container">

        {/* HEADER */}

        <header className="header">

          <div>
            <div className="eyebrow">
              PRODUCTIVITY PLANNER
            </div>

            <h1>My Daily Goals</h1>

            <p>
              Plan your time. Focus on what
              matters.
            </p>
          </div>

          <div className="header-date">
            <span>Today</span>

            <strong>
              {formatDate(today)}
            </strong>
          </div>

        </header>

        {/* SUMMARY */}

        <section className="summary-grid">

          <div className="summary-card">

            <div className="summary-icon">
              📋
            </div>

            <div>
              <span>Total Tasks</span>

              <strong>
                {visibleTasks.length}
              </strong>
            </div>

          </div>

          <div className="summary-card">

            <div className="summary-icon">
              ⏱️
            </div>

            <div>
              <span>Planned Time</span>

              <strong>
                {formatDuration(
                  totalMinutes
                )}
              </strong>
            </div>

          </div>

          <div className="summary-card">

            <div className="summary-icon">
              ✅
            </div>

            <div>
              <span>Completed</span>

              <strong>
                {completedCount}/
                {visibleTasks.length}
              </strong>
            </div>

          </div>

          <div className="summary-card progress-summary">

            <div
              className="progress-ring"
              style={{
                background:
                  `conic-gradient(#635bff ${progress}%, #ecebff ${progress}% 100%)`,
              }}
            >
              <div>
                <strong>
                  {progress}%
                </strong>
              </div>
            </div>

            <div>
              <span>Time Progress</span>

              <strong>
                {formatDuration(
                  completedMinutes
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* ADD TASK */}

        <section className="planner-card">

          <div className="section-heading">

            <div>
              <h2>
                Create a Schedule
              </h2>

              <p>
                Add a task and decide how much
                time you want to spend on it.
              </p>
            </div>

            <div className="plus-icon">
              +
            </div>

          </div>

          <form
            className="task-form"
            onSubmit={addTask}
          >

            <div className="form-group task-input">

              <label>Task</label>

              <input
                type="text"
                placeholder="What do you want to accomplish?"
                value={newTask}
                onChange={(e) =>
                  setNewTask(e.target.value)
                }
              />

            </div>

           <div className="form-group">

    <label>Date</label>

    <input
        type="date"
        value={date}
        min={today}
        onChange={(e) =>
        setDate(e.target.value)
        }
    />

</div>

            <div className="form-group">

              <label>Start Time</label>

              <input
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
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

                <option value="180">
                  3 hours
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>Priority</label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>

            <button
              className="add-button"
              type="submit"
            >
              + Add to Schedule
            </button>

          </form>

        </section>

        {/* SCHEDULE */}

        <section className="schedule-card">

          <div className="schedule-header">

            <div>

              <h2>
                Your Schedule
              </h2>

              <p>
                {visibleTasks.length} tasks •{" "}
                {formatDuration(
                  totalMinutes
                )}{" "}
                planned
              </p>

            </div>

            <div className="view-tabs">

              <button
                className={
                  view === "today"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setView("today")
                }
              >
                Today
              </button>

              <button
                className={
                  view === "tomorrow"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setView("tomorrow")
                }
              >
                Tomorrow
              </button>

              <button
                className={
                  view === "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setView("all")
                }
              >
                All
              </button>

            </div>

          </div>

          <div className="timeline">

            {visibleTasks.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  🗓️
                </div>

                <h3>
                  No plans yet
                </h3>

                <p>
                  Add a task above to start
                  planning your day.
                </p>

              </div>

            ) : (

              visibleTasks.map((task) => (

                <div
                  className={`schedule-item ${
                    task.completed
                      ? "completed"
                      : ""
                  }`}
                  key={task.id}
                >

                  <div className="time-column">

                    <strong>
                      {task.startTime}
                    </strong>

                    <span>
                      {formatDuration(
                        task.duration
                      )}
                    </span>

                  </div>

                  <div className="timeline-line">

                    <div className="timeline-dot">
                    </div>

                  </div>

                  <div className="task-card">

                    <button
                      className={`task-check ${
                        task.completed
                          ? "checked"
                          : ""
                      }`}
                      onClick={() =>
                        toggleTask(task.id)
                      }
                    >
                      {task.completed
                        ? "✓"
                        : ""}
                    </button>

                    <div className="task-content">

                      <div className="task-top">

                        <h3>
                          {task.title}
                        </h3>

                        <span
                          className={`priority-badge ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>

                      </div>

                      <div className="task-meta">

                        <span>
                          📅{" "}
                          {formatDate(
                            task.date
                          )}
                        </span>

                        <span>
                          ⏱️{" "}
                          {formatDuration(
                            task.duration
                          )}
                        </span>

                        {task.completed && (
                          <span className="done-label">
                            ✓ Completed
                          </span>
                        )}

                      </div>

                    </div>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTask(task.id)
                      }
                      title="Delete task"
                    >
                      🗑️
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

        <footer>

          <span>
            Daily Goals
          </span>

          <span>•</span>

          <span>
            Your schedule is automatically
            saved.
          </span>

        </footer>

      </div>
    </div>
  );
}
