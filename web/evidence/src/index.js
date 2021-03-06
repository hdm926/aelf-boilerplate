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
  //存证方案一：存图片内容
  inputFile() {
    const fileReceived = document.querySelector('#inputFile').files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileReceived);
    reader.onload = async (event)=>{
      const fileBuffer = event.target.result;
      const hashCode = AElf.utils.sha256(fileBuffer);
      const fileBytes = new Uint8Array(fileBuffer);
      const blob = new Blob([fileBytes],{type : "image/jpg"});

      evidenceContract = await aelf.chain.contractAt(evidenceContractAddress, priviteKeyWallet);
      (async () => {
        let preResult = await evidenceContract.FileExistOrNot.call(hashCode);
        if(preResult.value==="exist"){
          alert("文件已固定！")
        }
        else{
          let result = await evidenceContract.FilesToHash({
          id: hashCode,
          fileName: fileReceived.name,
          fileByte: fileBytes,
          fileSize: fileBytes.length,
        });
          document.getElementById("image").src = URL.createObjectURL(blob);
          document.getElementById("returnCode").innerHTML = hashCode;
        }
      })();
    }
  }
  //存证方案二：只存文件哈希码
  inputFilePlanB(){
    const fileReceived = document.querySelector('#inputFile').files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileReceived);
    reader.onload = async (event)=>{
      const fileBuffer = event.target.result;
      const hashCode = AElf.utils.sha256(fileBuffer);
      const fileBytes = new Uint8Array(fileBuffer);
      const blob = new Blob([fileBytes],{type : "image/jpg"});

      evidenceContract = await aelf.chain.contractAt(evidenceContractAddress, priviteKeyWallet);

      (async () => {
        let preResult = await evidenceContract.FileExistOrNot.call(hashCode);
        if(preResult.value==="exist"){
          alert("文件已固定！")
        }else{
          await evidenceContract.FilesToHashPlanB({
            id: hashCode,
            fileName: fileReceived.name,
            fileSize: fileBuffer.byteLength,
          });
          document.getElementById("image").src = URL.createObjectURL(blob);
          document.getElementById("returnCode").innerHTML = hashCode;
        }
      })();
    }
  }

  //验证方案二：通过原文件和之前的哈希码验证
   async verifyHashCodePlanB(){
    const hashInput = await document.getElementById("hashCode").value;//字符串类型
    const fileReceived = document.querySelector('#inputFile2').files[0];

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

  //验证方案一：通过哈希码验证，并返回原文件
  async verifyHashCode(){
    const code =  document.getElementById("hashCode").value;
    evidenceContract = await aelf.chain.contractAt(evidenceContractAddress, priviteKeyWallet);

      (async () => {
      let result = await evidenceContract.VerifyFiles.call(code);
      if(result!=null){
        let resultValue = result.value;
        let src ="data:image/jpg;base64," + resultValue + " alt=";
        document.getElementById('image').setAttribute('src', src);
      }
      else{
        alert("文件标识码有误！")
      }
      })();
    }

  render() {
     if(!aelf.isConnected()) {
       alert('Blockchain Node is not running.');
    }

    return (
      <div className="homepage">
          <div>
            <Input type="file" id="inputFile"/>
          </div>

          <div>
          <button class="button1" onClick={()=>this.inputFile()}>存图</button>
          </div>

          <div>
            <button class="button1" onClick={()=>this.inputFilePlanB()}>存哈希</button>
          </div>

          <p id="returnCode">文件id：</p>

          <div>
            <Input type = "text" placeholder = "输入存证时返回的文件标识码" id = "hashCode"/>
          </div>

          <div>
            <Input type="file" id="inputFile2"/>
          </div>


          <div>
            <button id = "button2" onClick={()=>this.verifyHashCodePlanB()}>验图与哈希</button>
          </div>

        <div>
          <button id = "button3" onClick={()=>this.verifyHashCode()}>验哈希</button>
        </div>

        <img id="image"/>

      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
























































































































