export default function (context, event) {
  return new Promise((resolve, reject) => {
    var policies = {};

    for (const name in context.groupDetails) {
      const group = context.groupDetails[name];
      for (const policy in group.policies) {
        policies[policy] = group.policies[policy];
      }
    }

    console.log("finished aggregating policies", policies);
    // TODO handle error here
    return resolve({ status: "ok", policies: policies });
  });
}
