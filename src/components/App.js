import React, { useState, useEffect } from "react";
import { List, Range } from "immutable";
import scheduler from "../services/round-robin";
import styles from "./App.pcss";

const App = props => {
  const [times, setTimes] = useState(2);
  const [teams, setTeams] = useState(List(["Joukkue 1", "Joukkue 2"]));
  const [schedule, setSchedule] = useState(undefined);

  useEffect(() => {
    const schedule = scheduler(teams.count(), parseInt(times, 10));

    setSchedule(schedule);
  }, [teams, times]);

  const addTeam = () => {
    setTeams(teams.push(`Joukkue X`));
  };

  const removeTeam = i => {
    setTeams(teams.remove(i));
  };

  const editTeam = (i, val) => {
    setTeams(teams.set(i, val));
  };

  return (
    <div className={styles.app}>
      <h1>Sarjasysteemitin</h1>

      <div className={styles.options}>
        <div>
          <div>
            <label>kohtaamiskerrat</label>
            <select
              value={times}
              onChange={e => {
                setTimes(e.target.value);
              }}
            >
              {Range(1, 5).map(r => {
                return (
                  <option key={r} value={r}>
                    {r}
                  </option>
                );
              })}
            </select>
          </div>

          <button onClick={addTeam}>Lisää joukkue</button>
        </div>

        {teams.map((team, i) => {
          return (
            <div key={i}>
              <div>
                <input
                  type="text"
                  value={team}
                  onChange={e => {
                    editTeam(i, e.target.value);
                  }}
                />
                <button
                  disabled={teams.count() <= 2}
                  onClick={() => removeTeam(i)}
                >
                  poista
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <hr />

      {schedule && (
        <div>
          {schedule.map((round, rid) => {
            return (
              <div key={rid}>
                <h2>kierros {rid + 1}</h2>

                <table border="2">
                  <tbody>
                    {round.map((matchup, mid) => {
                      console.log(matchup.toJS());
                      return (
                        <tr>
                          <td className={styles.td}>
                            {" "}
                            {teams.get(matchup.get("home"))}
                          </td>
                          <td className={styles.td}>-</td>
                          <td className={styles.td}>
                            {teams.get(matchup.get("away"))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
