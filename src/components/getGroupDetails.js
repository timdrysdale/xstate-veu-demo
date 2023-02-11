/* export default function (context, event) {
  return new Promise((resolve, reject) => {
    const data = { a: "a", b: "b" };
    console.log("groupDetails(JSON)", JSON.stringify(data));
    return resolve({ status: "ok", groupDetails: data });
  });
}
*/

export default function (context, event) {
  const group = "g-everyone"; //TODO just for test

  return fetch(
    import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/groups/" + group,
    {
      method: "GET",
      headers: {
        Authorization: context.token,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return new Promise((resolve, reject) => {
        resolve({ status: "ok", groupDetails: data });
      });
    });
}

/*
export default function (context, event) {
  const groupDetails = {};
  const promises = [];
  for (const group in context.groups) {
    console.log(group);
    const p = fetch(
      import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/groups/" + group,
      {
        method: "GET",
        headers: {
          Authorization: context.token,
        },
      }
    )
      .then((res) => res.json())
      .then((details) => {
        console.log(details);
        groupDetails[group] = details;
      });
    promises.push(p);
  }

  return promise.all(promises).then(() => {
    console.log("groupDetails", groupDetails);
    resolve({ status: "ok", groupDetails: groupDetails });
  });
}*/

/*
    function getData() {
      const groupDetails = {};
      const fs = [];
      const gs = [];

      const checkResult = (res) => (res.ok ? res.json() : Promise.resolve({}));

      for (const group in context.groups) {
        const f = fetch(
          import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/groups/" + group,
          {
            method: "GET",
            headers: {
              Authorization: context.token,
            },
          }
        ).then(checkResult);

        fs.push(f);
        gs.push(group);
      }

      return Promise.all(fs)
        .then((results) => {
          results.forEach(function (item, index) {
            groupDetails[gs[index]] = item;
          });
        })
        .catch((err) => console.error(err));
    }

    console.log("getGroupDetails");
    data = getData();
    console.log("getGroupDetails", data);

*/
