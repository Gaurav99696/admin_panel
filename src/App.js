import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [model, setModel] = useState({
    name: "",
    image: "",
    developer: "",
    description: "",
    category: "",
    tags: "",
    website_link: "",
    rating: "",
    number_of_reviews: "",
    user_clicks: "",
    installs: "",
  });

  const [success, setSuccess] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [allModels, setAllModels] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModel({ ...model, [name]: value });
  };

  const handleSubmit = () => {
    const formattedModel = {
      ...model,
      tags: model.tags.split(",").map((tag) => tag.trim()),
      rating: parseFloat(model.rating),
      number_of_reviews: model.number_of_reviews,
      user_clicks: model.user_clicks,
      installs: model.installs,
    };

    setLoading(true);
    fetch("http://localhost:5000/api/aimodels/createModel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedModel),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setModel({
          name: "",
          developer: "",
          description: "",
          category: "",
          tags: "",
          website_link: "",
          rating: "",
          number_of_reviews: "",
          user_clicks: "",
          installs: "",
        });
      })
      .catch((err) => {
        console.error("Post failed:", err.message);
        alert("Submission failed: " + err.message); // optional UI alert
      })
      .finally(() => setLoading(false));
  };

  const fetchAllModels = () => {
    setLoading(true);
    fetch("https://server-4885.onrender.com/api/aimodels/getModel/")
      .then((res) => res.json())
      .then((data) => {
        setAllModels(data.model);
        setViewAll(true);
      })
      .catch((err) => console.error("Fetch failed:", err))
      .finally(() => setLoading(false));
  };

  const deleteModel = (id) => {
    setLoading(true);
    fetch(`https://server-4885.onrender.com/api/aimodels/deleteModel/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchAllModels())
      .catch((err) => console.error("Delete failed:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div
      className="App"
      style={{
        padding: "40px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      {/* Loading Popup */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              padding: "20px 40px",
              backgroundColor: "white",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Loading...
          </div>
        </div>
      )}

      <header style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {viewAll ? "All Models" : "Submit AI Model"}
        </h2>

        <button
          onClick={() => (viewAll ? setViewAll(false) : fetchAllModels())}
          style={{
            marginBottom: "20px",
            padding: "10px 20px",
            fontWeight: "bold",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {viewAll ? "Back to Form" : "Show All Models"}
        </button>

        {!viewAll && (
          <>
            {success && (
              <div
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                }}
              >
                Model added successfully!
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                maxWidth: "600px",
              }}
            >
              {Object.keys(model).map((key) =>
                key === "description" ? (
                  <textarea
                    key={key}
                    name={key}
                    placeholder={key}
                    value={model[key]}
                    onChange={handleChange}
                    rows={3}
                    style={{ padding: "8px", gridColumn: "1 / -1" }}
                  />
                ) : (
                  <input
                    key={key}
                    name={key}
                    placeholder={key}
                    value={model[key]}
                    onChange={handleChange}
                    style={{ padding: "8px" }}
                  />
                )
              )}
            </div>
            <button
              onClick={handleSubmit}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Submit
            </button>
          </>
        )}

        {viewAll && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {allModels.map((item) => (
              <div
                key={item._id}
                style={{
                  border: "1px solid #ddd",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "5px",
                  }}
                />
                <h3 style={{ marginBottom: "10px" }}>{item.name}</h3>
                <p>
                  <strong>Developer:</strong> {item.developer}
                </p>
                <p>
                  <strong>Category:</strong> {item.category}
                </p>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <p>
                  <strong>Tags:</strong> {item.tags.join(", ")}
                </p>
                <p>
                  <strong>Rating:</strong> {item.rating}
                </p>
                <p>
                  <strong>Reviews:</strong> {item.number_of_reviews}
                </p>
                <p>
                  <strong>Clicks:</strong> {item.user_clicks}
                </p>
                <p>
                  <strong>Installs:</strong> {item.installs}
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={item.website_link} target="_blank" rel="noreferrer">
                    Visit
                  </a>
                </p>
                <button
                  onClick={() => deleteModel(item._id)}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
