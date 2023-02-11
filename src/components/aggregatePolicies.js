export default function (context, event) {
  return new Promise((resolve, reject) => {
    var policies = {};
    console.log("groupDetails(JSON)", JSON.stringify(context.groupDetails));
    console.log(context);
    console.log(context.groupDetails);

    const gd = context.groupDetails;

    console.log("groupDetails", gd);
    console.log("keys", Object.keys(gd));
    console.log("prop names", Object.getOwnPropertyNames(gd));
    /*
    for (const name in context.groupDetails) {
      const group = context.groupDetails[name];
      console.log("group", name, group);
      for (const policy in group.Policies) {
        policies[policy] = group.Policies[policy];
      }
    }*/
    console.log("finished aggregating policies", policies);
    // TODO handle error here
    return resolve({ status: "ok", policies: policies });
  });
}
