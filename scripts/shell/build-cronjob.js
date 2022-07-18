const fs = require('fs');
const path = require('path');

const jobList = [
  {
    name: 'notifications',
    schedule: '*/5 * * * *',
  },
];

const template = fs.readFileSync(path.join(__dirname, 'cronjob-template.yaml'));

for (let index = 0; index < jobList.length; index += 1) {
  const job = jobList[index];

  if (!job.schedule) {
    // eslint-disable-next-line no-continue
    continue;
  }

  const yaml = `${template}`
    .replace(/\$JOB_ALIAS/g, job.name)
    .replace(/\$JOB_SCHEDULE/g, job.schedule);

  fs.writeFileSync(path.join(
    __dirname,
    '..',
    'kubernetes',
    'cronjobs',
    `cronjob-${job.name}.yaml`,
  ), yaml);
}

process.exit(0);
