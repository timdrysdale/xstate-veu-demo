import { assign, createMachine } from "xstate";

function hasSameProps(obj1, obj2) {
  return Object.keys(obj1).every(function (prop) {
    return obj2.hasOwnProperty(prop);
  });
}

const getGroupDetails = (context, event) =>
  new Promise((resolve, reject) => {
    var groupDetails = {};

    for (const group in context.groups) {
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

    if (hasSameProps(obj1, obj2)) {
      return resolve({ status: "ok", groupDetails: groupDetails });
    } else {
      return reject({
        status: "incomplete",
        groupDetails: groupDetails,
      });
    }
  });
