import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import React, { Component } from 'react';
import { Input, Form, message, Button } from 'antd';
import 'antd/dist/antd.css';
import reqwest from 'reqwest';
import AElf from 'aelf-sdk';

const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:3000'));
const newWallet = AElf.wallet.createNewWallet();
const evidenceContractName = 'AElf.ContractNames.EvidenceContract';

let evidenceContractAddress;
(async () => {
  const chainStatus = await aelf.chain.getChainStatus();
  const GenesisContractAddress = chainStatus.GenesisContractAddress;
  const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, newWallet);
  evidenceContractAddress = await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(evidenceContractName));
})();

const wallet = AElf.wallet.createNewWallet();
let evidenceContract;
(async () => {
  evidenceContract = await aelf.chain.contractAt(evidenceContractAddress, wallet)
})();

aelf.chain.contractAt(evidenceContractAddress, wallet)
  .then(result => {
    evidenceContract = result;
  });

aelf.chain.contractAt(evidenceContractAddress, wallet, (error, result) => {if (error) throw error; evidenceContract = result;});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileReceived : [],
      fileName : '',
    }
    this.inputFile = this.inputFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  inputFile(){
    const fileReceived = document.querySelector('#input').files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileReceived);

    reader.onload = function () {
      console.log(fileReceived.name);
      console.log(this.result);
      console.log(new Blob([this.result]))
    }
    this.setState({
      fileReceived : this.result,
      fileName : fileReceived.name,});
  }

  handleSubmit() {
    const fileReceived = this.state.fileReceived;
    const hashCode = AElf.utils.sha256(fileReceived);
    (async () => {
      const result = await evidenceContract.FilesToHash.call({
        id: hashCode,
        fileName: this.state.filename,
        fileByte: fileReceived,
        fileSize: fileReceived.length,
        saveTime: new Date(),
      });
    })();
    return (
      <h1>hashCode</h1>
    );
  }

  render() {
    // if(!aelf.isConnected()) {
    //   alert('Blockchain Node is not running.');
    //   process.exit(1);
    // }

    return (
      <div className="homepage">
        <Form
          id="form_test"
          onSubmit={this.handleSubmit}
          target="nm_iframe"
          method="post"
          enctype="multipart/form-data"
        >
          <iframe id="id_iframe" name="nm_iframe" style={{ display: 'none' }}/>
          <div id="img_div">
            <img id="file_img" src="" alt=""/>
          </div>
          <div id="input_div">
            选择文件
            {<Input type="file" id="input" onChange={this.inputFile}/>}
          </div>
          <div>
            <button onClick={()=>this.handleSubmit()}>提交</button>
          </div>
        </Form>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
























































































































