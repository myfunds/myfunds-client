var request = require('request');
username = process.env.RANCHER_USER || 'test';
password = process.env.RANCHER_PW || 'test';
console.log('USER => ', username);
var options = {
  method: 'POST',
  uri: "https://rancher.bcbrian.com/v2-beta/projects/1a5/services/1s39?action=upgrade",
  body: `{
    "type": "serviceUpgrade",
    "inServiceStrategy": {
      "type": "inServiceUpgradeStrategy",
      "batchSize": 1,
      "intervalMillis": 2000,
      "launchConfig": {
        "type": "launchConfig",
        "capAdd": [ ],
        "capDrop": [ ],
        "count": null,
        "cpuSet": null,
        "cpuShares": null,
        "dataVolumes": [ ],
        "dataVolumesFrom": [ ],
        "description": null,
        "devices": [ ],
        "dns": [ ],
        "dnsSearch": [ ],
        "domainName": null,
        "environment": { },
        "hostname": null,
        "imageUuid": "docker:bcbrian/budget-client",
        "kind": "container",
        "labels": {
          "io.rancher.container.pull_image": "always",
          "io.rancher.scheduler.affinity:host_label": "app30=finance-client"
        },
        "logConfig": {
          "type": "logConfig",
          "config": { },
          "driver": ""
        },
        "memory": null,
        "memoryMb": null,
        "memorySwap": null,
        "networkMode": "managed",
        "pidMode": null,
        "ports": [ ],
        "privileged": false,
        "publishAllPorts": false,
        "readOnly": false,
        "requestedIpAddress": null,
        "startOnCreate": true,
        "stdinOpen": true,
        "tty": true,
        "user": null,
        "userdata": null,
        "version": "a5cb3664-5157-414d-9da3-4290a0a90214",
        "volumeDriver": null,
        "workingDir": null,
        "dataVolumesFromLaunchConfigs": [ ],
        "networkLaunchConfig": null,
        "vcpu": 1
      },
      "previousLaunchConfig": {
        "type": "launchConfig",
        "capAdd": [ ],
        "capDrop": [ ],
        "count": null,
        "cpuSet": null,
        "cpuShares": null,
        "dataVolumes": [ ],
        "dataVolumesFrom": [ ],
        "description": null,
        "devices": [ ],
        "dns": [ ],
        "dnsSearch": [ ],
        "domainName": null,
        "environment": { },
        "hostname": null,
        "imageUuid": "docker:bcbrian/budget-client",
        "kind": "container",
        "labels": {
          "io.rancher.container.pull_image": "always",
          "io.rancher.scheduler.affinity:host_label": "app30=finance-client"
        },
        "logConfig": {
          "type": "logConfig",
          "config": { },
          "driver": ""
        },
        "memory": null,
        "memoryMb": null,
        "memorySwap": null,
        "networkMode": "managed",
        "pidMode": null,
        "ports": [ ],
        "privileged": false,
        "publishAllPorts": false,
        "readOnly": false,
        "requestedIpAddress": null,
        "startOnCreate": true,
        "stdinOpen": true,
        "tty": true,
        "user": null,
        "userdata": null,
        "version": "755d1391-1bbf-4f62-9430-e949b6bf3791",
        "volumeDriver": null,
        "workingDir": null,
        "dataVolumesFromLaunchConfigs": [ ],
        "networkLaunchConfig": null,
        "vcpu": 1
      },
      "previousSecondaryLaunchConfigs": [ ],
      "secondaryLaunchConfigs": [ ],
      "startFirst": false
    },
    "toServiceStrategy": null
  }`,
  headers: {
    'Authorization': 'Basic ' + new Buffer(username + ":" + password).toString('base64'),
    'Content-Type': 'application/json'
  }
};
request(options, function(error, response, body) {
  if (error) {
    console.log('ERROR => ', error);
    process.exit(1);
  }
  body = JSON.parse(body);
  if (body && body.status >= 400) {
    console.log('ERROR: FAILED TO UPGRADE => ', body);
    process.exit(1);
  }
  console.log('Success => FINALIZE UP GRADE @ RANCHER');
  process.exit(0);
});
