export default function (context, event) {
  return new Promise((resolve, reject) => {
    var slotMap = {}; //map to de-duplicate (just in case the manifest has repeated slot names by mistake)

    for (const name in context.policies) {
      const policy = context.policies[name];

      policy.slots.forEach(function (item) {
        slotMap[item] = true;
      });
    }

    //convert map back to array
    let slots = Object.keys(slotMap);

    console.log("finished aggregating slots", slots);
    // TODO handle error here
    return resolve({ status: "ok", slots: slots });
  });
}
