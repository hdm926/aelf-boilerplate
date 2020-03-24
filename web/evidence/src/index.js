import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import React, { Component } from 'react';
import $ from 'jquery';
import { Input, Form, message, Button } from 'antd';
import 'antd/dist/antd.css';
import AElf from 'aelf-sdk';

const evidenceContractName = 'AElf.ContractNames.EvidenceContract';
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:1235'));

function inputFile(props) {
  let file = document.querySelector('#input').files[0];
  if(file){
    var reader = new FileReader();
    // 图片文件转换为base64
    reader.readAsDataURL(file);
  }
  this.setState({
    file:file
  })
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state ={
      fileList:[],
      file:{},
      imageUrl:'',
      input:{},
      resdata:"",
      uploading: false
    }
  }

  handleSubmit(props) {
    let file = this.props.file;
    let formData = new FormData();
    let temp = file.files[0];
    if (temp){
      formData.append('file',temp);
      file.src = window.URL.createObjectURL(temp);
      $.ajax({
        url:"/test/fileUpLoad",//后端接口
        type:"POST",
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success: function(result){
          alert(result);
        }
      })
    }
    //alert('call succeed')
  }

  render() {
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
            <Input type="file" id="input" name="file" onChange={this.inputFile}/>
          </div>
          <div>
            <button onClick={()=>this.handleSubmit(this.props)}>提交</button>
          </div>
        </Form>
      </div>
    );
  }
}


//注意，Input中的name代表的是传给后台的参数 enctype="multipart/form-data"是前后台约定的类型
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
























































































































