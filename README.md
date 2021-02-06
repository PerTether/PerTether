# PerTether
## Introduction
PerTether is a tool that can automatically initialize a private Ethereum blockchain and execute performance tests on it. PerTether is designed based on the performance concerns of the private Ethereum blockchain. PerTether can fully test the private Ethereum blockchain in different scenarios with a single start operation. There is no need to build test chain and simulate the scenarios manually. Researchers only need to deﬁne a simple conﬁguration, PerTether will do the rest steps, which provides convenience for the researchers. 
## Installation
If you run our tools you need to follow the following requirements.

### Hardware requirement

At  least  4 CPU Cores and 16 GB Memory.  Ethereum miners need lots of resource, more resource means better performance.

### Software requirement

#### Python 
Version 3.6 or above. You can download python at https://www.python.org/downloads/. To install the package to your computer, simply run the following command in the base directory:

```shell
pip install Django
pip install json
pip install urllib
pip install shutil
pip install zipfile
pip install os
pip install zipstream
pip install pandas as pd
pip install time
pip install subprocess
pip install PyExecJS
```

#### NodeJS

Version 8.12.0 or above, but not exceed version 8. You can download NodeJS at https://nodejs.org/zh-cn/download/. Run ``` npm install ```  in the root directory to install dependences.

#### Docker

Version 18.09.1 or above. Docker image geth required. You can download Docker at https://docs.docker.com/. Run ```docker pull ethereum/client-go:alltools-v1.8.26```.

#### Docker-compose

Version 1.23.2 or above. You can download Docker-compose at https://docs.docker.com/compose/install/. Need docker subnet support.

## How do I run PerTether?

* Step 1: Clone the PerTether repository.

* ```shell
  git clone https://github.com/morethanbest/PerTether.git
  cd PerTether
  ```

* Step 2: Enter the directory of gui and execute the following command to start PerTether. 

* ```shell
  cd gui
  python manage.py runserver 127.0.0.1:8000
  ```

* Step 3: Enter the URL http://127.0.0.1:8000/experiment/ in the browser to enter the Ethereum configuration page.

## Running Example

PerTether enables automated deployment of the Ethereum test blockchain.

* Users can configure difficulty, gas limlit, start type, client type, miner count and node count on the Ethereum configuration web page according to their own needs.
![](https://github.com/morethanbest/PerTether/blob/master/gui/static/images/config.png)

* Users can configure start request rate, finish request rate, duration, client type and smart contract on the test configuration web page according to their own needs.
![](https://github.com/morethanbest/PerTether/blob/master/gui/static/images/testConfig.png)

* Throughput web page shows the throughput differentdifficulty and gas limit settings.(The picture with gray background indicates that the report has not been tested yet)
![](https://github.com/morethanbest/PerTether/blob/master/gui/static/images/throught.png)

* Latency web page shows the latency differentdifficulty and gas limit settings.(The picture with gray background indicates that the report has not been tested yet)
![](https://github.com/morethanbest/PerTether/blob/master/gui/static/images/latency.png)

* TxCompletion web page shows the transaction completion rate of different gas priceand request rate. (The picture with gray background indicates that the report has not been tested yet)
![](https://github.com/morethanbest/PerTether/blob/master/gui/static/images/txcompletion.png)

* DetailedLatency  web page shows the latency of different gas priceand request rate.(The picture with gray background indicates that the report has not been tested yet)
![](https://github.com/morethanbest/PerTether/blob/master/gui/static/images/detailedLatency.png)

* Users can download test report compression files, including reports in jpg、csv and json format.
![](https://github.com/morethanbest/PerTether/blob/master/gui/static/images/download.png)




