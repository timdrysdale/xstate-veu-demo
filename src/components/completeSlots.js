export default function (context, event) {
  return new Promise((resolve, reject) => {
    let slots = {};

    for (const name in context.slots) {
      const av = context.available[name];
      slots[name] = context.slots[name];
      slots[name].available = context.available[name];
      slots[name].policyDetails = context.policies[slots[name].policy];
      //TODO add status here
    }
    console.log("finished combining slots", slots);
    // TODO handle error here
    return resolve({ status: "ok", slots: slots });
  });
}
