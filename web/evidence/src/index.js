import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import React, { Component } from 'react';
import { Input, Form, message, Button } from 'antd';
import 'antd/dist/antd.css';
import AElf from 'aelf-sdk';



const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:1235'));
const priviteKeyWallet = AElf.wallet.getWalletByPrivateKey('b842c00d26be7a38cf049ec381df1841199ea15ec3cc460b074a56e1a2d480ae');
const evidenceContractName = 'AElf.ContractNames.EvidenceContract';

let evidenceContractAddress;
(async () => {
  const chainStatus = await aelf.chain.getChainStatus();
  const GenesisContractAddress = chainStatus.GenesisContractAddress;
  const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, priviteKeyWallet);
  evidenceContractAddress = await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(evidenceContractName));
})();

let evidenceContract;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileReceived : [],
      fileName : '图片6',
      hashCode : '',
    }
    this.inputFile = this.inputFile.bind(this);
    this.inputFilePlanB = this.inputFilePlanB.bind(this);
    this.verifyHashCodePlanB = this.verifyHashCodePlanB.bind(this);
    this.verifyHashCode = this.verifyHashCode.bind(this);
  }

  //选择并提交上传的文件
  inputFile() {
    const fileReceived = document.querySelector('#inputFile').files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileReceived);
    reader.onload = async (event)=>{
      const fileBuffer = event.target.result;
      const hashCode = AElf.utils.sha256(fileBuffer);
      const fileBytes = new Uint8Array(fileBuffer);
      evidenceContract = await aelf.chain.contractAt(evidenceContractAddress, priviteKeyWallet);
      (async () => {
        let result = await evidenceContract.FilesToHash({
          id: hashCode,
          fileName: this.state.fileName,
          fileByte: fileBytes,
          fileSize: fileBytes.length,
        });
        document.getElementById("returnCode").innerHTML = hashCode;
      })();
    }
  }
  //只上传文件哈希码
  inputFilePlanB(){
    const fileReceived = document.querySelector('#inputFile').files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileReceived);
    reader.onload = async (event)=>{
      const fileBuffer = event.target.result;
      const hashCode = AElf.utils.sha256(fileBuffer);
      evidenceContract = await aelf.chain.contractAt(evidenceContractAddress, priviteKeyWallet);

      (async () => {
        let result = await evidenceContract.FilesToHashPlanB({
          id: hashCode,
          fileName: fileReceived.name,
          fileSize: fileBuffer.byteLength,
        });
        document.getElementById("returnCode").innerHTML = hashCode;
      })();
    }
  }

  //通过原文件和之前的哈希码验证
   async verifyHashCodePlanB(){
    const hashInput = await document.getElementById("hashCode").value;//字符串类型
    const fileReceived = document.querySelector('#inputFile').files[0];

    const reader = new FileReader();
    reader.readAsArrayBuffer(fileReceived);

     reader.onload = async (event)=>{
       const fileBuffer = event.target.result;
       const hashFromFile = AElf.utils.sha256(fileBuffer);
       evidenceContract = await aelf.chain.contractAt(evidenceContractAddress, priviteKeyWallet);
       (async () => {
         let result = await evidenceContract.VerifyFilesPlanB.call({
           hashInput: hashInput,
           hashFromFile: hashFromFile,
         });
         alert(result.value);
       })();

     }
  }

  //通过哈希码验证，并返回原文件
  async verifyHashCode(){
    const code =  document.getElementById("hashCode").value;
    evidenceContract = await aelf.chain.contractAt(evidenceContractAddress, priviteKeyWallet);

      (async () => {
      let result = await evidenceContract.VerifyFiles.call(code);
        console.log(result);
      })();

     /* var fileBytes = new ArrayBuffer(result.value);
      var blob = new Blob([fileBytes]);*/
    }

  render() {
     if(!aelf.isConnected()) {
       alert('Blockchain Node is not running.');
    }

    return (
      <div className="homepage">
        <Form action='' name="formUpLoad" method="post" enctype="multipart/form-data" >
          <iframe id="id_iframe" name="nm_iframe" style={{ display: 'none' }}/>

          <div>
            <Input type="file" id="inputFile"/>
          </div>

          <div>
          <button class="button" onClick={()=>this.inputFile()}>存图</button>
          </div>

          <div>
            <button class="button" onClick={()=>this.inputFilePlanB()}>存哈希</button>
          </div>

          <p calss = "p" id="returnCode">文件id</p>
        </Form>

          <div>
        <Input type = "text" id = "hashCode"/>
         </div>

          <div>
            <button class="button" onClick={()=>this.verifyHashCodePlanB()}>验证图片PlanB</button>
          </div>

        <div>
          <button class="button" onClick={()=>this.verifyHashCode()}>验证哈希</button>
        </div>

      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
























































































































