import React, { useState, useEffect } from "react";
import { List, Range, Map, Set, Repeat } from "immutable";
import scheduler from "../services/round-robin";
import styles from "./App.pcss";
import Select from "react-select";

const App = props => {
  const [times, setTimes] = useState(2);
  const [teams, setTeams] = useState(
    List([
      "Joukkue 1",
      "Joukkue 2",
      "Joukkue 3",
      "Joukkue 4",
      "Joukkue 5",
      "Joukkue 6",
      "Joukkue 7",
      "Joukkue 8"
    ])
  );
  const [schedule, setSchedule] = useState(undefined);

  const [startWeek, setStartWeek] = useState(23);
  const [skipWeeks, setSkipWeeks] = useState(Set.of(25));
  const [doubleWeeks, setDoubleWeeks] = useState(Set.of(24));

  useEffect(() => {
    let schedule = scheduler(teams.count(), times);

    const availableWeeks = Range(startWeek, 100)
      .map(wid => {
        if (skipWeeks.includes(wid)) {
          return false;
        }

        const numberOfGames = doubleWeeks.includes(wid) ? 2 : 1;

        const weekId = wid <= 52 ? wid : wid - 52;
        return Repeat(weekId, numberOfGames);
      })
      .flatten(true)
      .filter(w => w)
      .toList();

    console.log(availableWeeks.toJS(), "aw");

    schedule = schedule.map((s, i) => {
      return Map({
        games: s,
        round: i,
        week: availableWeeks.get(i)
      });
    });

    schedule = schedule.groupBy(s => s.get("week"));

    setSchedule(schedule);
  }, [teams, times, startWeek, doubleWeeks, skipWeeks]);

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
          <hr />

          <div>
            <label className={styles.label}>aloitusviikko</label>
            <select
              value={startWeek}
              onChange={e => {
                setStartWeek(parseInt(e.target.value, 10));
              }}
            >
              {Range(1, 53).map(week => {
                return (
                  <option key={week} value={week}>
                    {week}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className={styles.label}>skipattavat viikot</label>

            <Select
              value={skipWeeks
                .map(sw => {
                  return {
                    value: sw,
                    label: "viikko " + sw
                  };
                })
                .toArray()}
              isMulti
              options={Range(startWeek, 53)
                .map(r => {
                  return {
                    value: r,
                    label: "viikko " + r
                  };
                })
                .toArray()}
              multiple
              onChange={v => {
                console.log(v);

                setSkipWeeks(Set(v.map(v => v.value)));
              }}
            />
          </div>

          <div>
            <label className={styles.label}>tuplaviikot</label>

            <Select
              value={doubleWeeks
                .map(sw => {
                  return {
                    value: sw,
                    label: "viikko " + sw
                  };
                })
                .toArray()}
              isMulti
              options={Range(startWeek, 53)
                .map(r => {
                  return {
                    value: r,
                    label: "viikko " + r
                  };
                })
                .toArray()}
              multiple
              onChange={v => {
                setDoubleWeeks(Set(v.map(v => v.value)));
              }}
            />
          </div>

          <hr />

          <div>
            <label className={styles.label}>kohtaamiskerrat</label>
            <select
              value={times}
              onChange={e => {
                setTimes(parseInt(e.target.value, 10));
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
          {schedule
            .map((week, weekId) => {
              return (
                <div key={weekId}>
                  <h2>Viikko {weekId}</h2>
                  {week.map((round, rid) => {
                    return (
                      <div key={rid}>
                        <h3>kierros {round.get("round") + 1}</h3>

                        <table border="2">
                          <tbody>
                            {round.get("games").map((matchup, mid) => {
                              return (
                                <tr key={mid}>
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
              );
            })
            .toList()}
        </div>
      )}
    </div>
  );
};

export default App;
