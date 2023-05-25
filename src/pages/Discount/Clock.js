function Clock({ timerDays, timerHours, timerMinutes, timerSeconds }) {
  return (
    <div className="row">
      <div className="col-12">
        <p>
          {timerDays}:{timerHours}:{timerMinutes}:{timerSeconds}
        </p>
      </div>
    </div>
  );
}

Clock.defaultProps = {
  timerDays: 0,
  timerHours: 0,
  timerMinutes: 0,
  timerSeconds: 0,
};

export default Clock;
