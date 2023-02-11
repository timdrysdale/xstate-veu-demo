export default function (context, event) {
  return new Promise((resolve, reject) => {
    var groupDetails = {};

    for (const group in context.groups) {
      console.log("getting group details for", group);
      fetch(import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/groups/" + group, {
        method: "GET",
        headers: {
          Authorization: context.token,
        },
      })
        .then((res) => res.json())
        .then((details) => {
          groupDetails[group] = details;
        });
    }
    console.log("finished getting groups", groupDetails);
    // TODO handle error here
    return resolve({ status: "ok", groupDetails: groupDetails });
  });
}
