let onlineLevelNames = []

async function postJSON(url, data, callback) {
    try {
      const response = await fetch(url, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("Success:", result);
      callback(result)
    } catch (error) {
      console.error("Error:", error);
    }
  }