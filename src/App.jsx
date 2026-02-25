import { useEffect, useState } from "react";
import "./App.css";

const names = [
  "ditto",
  "pikachu",
  "bulbasaur",
  "charmander",
  "squirtle",
  "eevee",
  "jigglypuff",
  "meowth",
  "psyduck",
  "snorlax",
  "mewtwo",
  "mew",
  "chikorita",
  "cyndaquil",
  "totodile",
  "togepi",
  "mareep",
  "marill",
  "hoppip",
  "sunkern",
];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalClicks, setTotalClicks] = useState(0);
  const [highestClicks, setHighestClicks] = useState(0);
  const [cheating, setCheating] = useState(false);

  const handleCheat = (event) => {
    setCheating(event.target.checked);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPromises = names.map((name) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`),
        );
        const responses = await Promise.all(fetchPromises);
        const jsonPromises = responses.map((response) => response.json());
        const results = await Promise.all(jsonPromises);

        const objPromises = results.map((result) => {
          return {
            itemname: result.name,
            image: result.sprites.front_default,
            nbClicks: 0,
          };
        });
        const objResults = await Promise.all(objPromises);
        setData(objResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    console.log(data);
    fetchData();
  }, []);

  const resetClicks = () => {
    const resetData = data.map((item) => ({ ...item, nbClicks: 0 }));
    setData(resetData);
    setTotalClicks(0);
  };

  const shuffleData = () => {
    const newData = [...data];
    for (let i = newData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newData[i], newData[j]] = [newData[j], newData[i]];
    }
    setData(newData);
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && (
        <div>
          <p className="highscore">Highest Clicks: {highestClicks}</p>
          <div className="cheat">
            <label>
              <input
                type="checkbox"
                checked={cheating}
                onChange={handleCheat}
              />
              I'm cheating! I'm unironically cheating!
            </label>
          </div>
        </div>
      )}

      <div className="pokemoncards">
        {data &&
          data.map((item, index) => (
            <div
              className="pokemon"
              key={index}
              onClick={() => {
                if (item.nbClicks === 0) {
                  //alert(`You clicked on ${item.itemname} for the first time!`);
                  const newData = [...data];
                  newData[index].nbClicks += 1;
                  setData(newData);
                  setTotalClicks(totalClicks + 1);
                  if (totalClicks + 1 > highestClicks) {
                    setHighestClicks(totalClicks + 1);
                  }
                  shuffleData();
                } else {
                  alert(
                    `You already clicked on ${item.itemname}! Your score: ${totalClicks}`,
                  );
                  resetClicks();
                }
              }}
            >
              <h2>{item.itemname}</h2>
              <img src={item.image} alt={item.itemname} />
              {cheating && <p>Number of Clicks: {item.nbClicks}</p>}
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
