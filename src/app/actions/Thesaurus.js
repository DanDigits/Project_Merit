export const getSynonyms = async ({ word }) => {
  const response = await fetch(
    "https://api.api-ninjas.com/v1/thesaurus?word=" + word,
    {
      method: "GET",
      headers: { "X-Api-Key": "3mdgGfSLAkfvU/o1sW5nmw==FF2xrIpAZaGsD7Y8" },
      contentType: "application/json",
      success: function (result) {
        console.log("result", result);
      },
      error: function ajaxError(jqXHR) {
        console.error("Error: ", jqXHR.responseText);
      },
    }
  );
  //console.log("response", response);
  const data = await response.json();
  console.log("data", data);
  return data;
};
