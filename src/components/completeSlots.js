export default function (context, event) {
  return new Promise((resolve, reject) => {
    let slots = {};
    console.log(context.slots);

    // we do some gymnastics to avoid a circular error cropping up later
    // when try to get a value of completedSlots
    const policies = JSON.parse(JSON.stringify(context.policies));
    console.log(policies);

    for (const name in context.slots) {
      console.log("completing slot", name);
      const av = context.available[name];
      let slot = context.slots[name];
      let policy = String(context.slots[name].policy);
      console.log(policy);
      console.log(policies[policy]);
      slot.available = av;
      slot.policy = policy;
      slot.policyDetails = policies[policy];
      slot.id = String(name); //store our key inside object for later use in subcomponents
      slots[name] = slot;
    }
    console.log("finished combining slots", slots);
    // TODO handle error here
    return resolve({ status: "ok", slots: slots });
  });
}
