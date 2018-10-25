exports.helloGCSGeneric = (event, callback) => {
  const file = event.data;

  console.log(`Event ${event.context.eventId}`);
  console.log(`  Event Type: ${event.context.eventType}`);
  console.log(`  Bucket: ${file.bucket}`);
  console.log(`  File: ${file.name}`);
  console.log(`  Metageneration: ${file.metageneration}`);
  console.log(`  Created: ${file.timeCreated}`);
  console.log(`  Updated: ${file.updated}`);

  callback();
};
