import HabitRow from "./HabitRow.jsx";

export default function HabitList({ habits, onToggleToday, onDelete }) {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon" aria-hidden="true">🌰</span>
        <p className="empty-state-title">Your forest starts here!</p>
        <p className="empty-state-body">
          Plant your first habit above — every completion helps it grow.
        </p>
      </div>
    );
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          onToggleToday={onToggleToday}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
