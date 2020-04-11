import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import React, { Component } from 'react';
import { Input, Form, message, Button } from 'antd';
import 'antd/dist/antd.css';
import AElf from 'aelf-sdk';

//端口号？
/*
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:1235'));
const newWallet = AElf.wallet.createNewWallet();
const evidenceContractName = 'AElf.ContractNames.EvidenceContract';

let evidenceContractAddress;
(async () => {
  const chainStatus = await aelf.chain.getChainStatus();
  const GenesisContractAddress = chainStatus.GenesisContractAddress;
  const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, newWallet);
  evidenceContractAddress = await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(evidenceContractName));
})();

let evidenceContract;
(async () => {
  evidenceContract = await aelf.chain.contractAt(evidenceContractAddress, newWallet)
})();
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileReceived : [],
      fileName : '',
      hashCode : '',
    }
    this.inputFile = this.inputFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputHashCode = this.handleHashCode.bind(this);
    this.handleHashCode = this.handleHashCode.bind(this);
  }

  //选择上传的文件
  inputFile(){
    const fileReceived = document.querySelector('#input').files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileReceived);
    const that = this;
    reader.onload = function () {
      console.log(fileReceived.name);//文件名
      console.log(this.result);
      that.setState({
        fileReceived : this.result,
        fileName : fileReceived.name,});
    }
  }

  //提交选择的文件
  handleSubmit() {
    const fileBytes = this.state.fileReceived;
    const hashCode = AElf.utils.sha256(fileBytes);
    console.log(this.state.fileReceived);
    console.log("hash:"+hashCode);
    /*(async () => {
        await evidenceContract.FilesToHash.call({
        id: hashCode,
        fileName: this.state.filename,
        fileByte: fileReceived,
        fileSize: fileReceived.length,
        saveTime: new Date(),
      });
      return (
        <h1>hashCode</h1>
      );
    })();*/

  }

  //取得输入的哈希码
  handleHashCode(){
    const code = document.getElementById("hashCode").value;
    this.setState({
      hashCode: code,
    })
    /*(async () => {
      const result = await evidenceContract.VerifyFiles.call({
        id: code,
      });
      return (
        <h1>result</h1>
      );
    })()*/

  }

  render() {
    // if(!aelf.isConnected()) {
    //   alert('Blockchain Node is not running.');
    //   process.exit(1);
    // }

    return (
      <div className="homepage">
        <Form action='' name="formUpLoad" method="post" enctype="multipart/form-data" onSubmit={this.handleSubmit}>
          <iframe id="id_iframe" name="nm_iframe" style={{ display: 'none' }}/>

          <div id="input_div">
            选择文件
            <Input type="file" id="input" onChange={this.inputFile}/>
          </div>

          <div>
            <button onClick={()=>this.handleSubmit()}>提交</button>
          </div>
        </Form>

          <div id = 'verify'>
        <Input type = "textarea" id = "hashCode"/>
      </div>

          <div>
            <button onClick={()=>this.handleHashCode()}>验证</button>
          </div>


      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
























































































































