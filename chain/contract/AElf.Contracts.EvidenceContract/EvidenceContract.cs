using System;
using System.IO;
using System.Net.Http;
using AElf.Types;
using Google.Protobuf;
using Google.Protobuf.Collections;
using Google.Protobuf.WellKnownTypes;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp;

namespace AElf.Contracts.EvidenceContract
{
    public class EvidenceContract : EvidenceContractContainer.EvidenceContractBase
    {
        public override VerifyAnswer VerifyFiles(Hash input)
        {
            StringValue filePath = new StringValue();
            var fP = "D:\\evidence\\" + input.ToString();
            
            Assert(!File.Exists(fP),"Wrong input!");
            filePath.Value = fP;
            
            Hash hash = FilesToHash(filePath);

            Assert(hash!=input,"This file has been changed!");
            
            var verifyAnswer = State.VerifyAnswer[input];
            verifyAnswer.IsSame = true;
                
            byte[] bytes = FileToBytes(filePath.Value);
            verifyAnswer.Value = bytes.ToString();
            
            return State.VerifyAnswer[input];
        }
        
        public override Hash FilesToHash(StringValue input)
        {
            string fileUrl = input.Value;
            Assert(!File.Exists(fileUrl),"Wrong file path!");
            //文件转成字节流
            byte[] fileBytes = FileToBytes(fileUrl);
            
            //从文件绝对路径中提取文件扩展名
            string[] fu = fileUrl.Split('.');
            string extension = fu[fu.Length - 1];
            
            Hash id = Hash.FromByteArray(fileBytes);
            var fileReveived = State.FileReceived[id];
            
            fileReveived.FileName = fileReveived.Id.ToString() + '.' + extension;
            fileReveived.FilePath = "D://evidence//" + fileReveived.FileName;
            fileReveived.FileSize = fileBytes.Length;
            fileReveived.SaveTime = Timestamp.FromDateTime(DateTime.Now);
            
            BytesToFile(fileBytes , fileReveived.FilePath);
            
            return Hash.FromByteArray(fileBytes);
        }

        public byte[] FileToBytes(string fileUrl)
        {
            byte[] fileBytes = null;
            if (File.Exists(fileUrl))
            {
                FileStream fileStream = null;
                try
                {
                    fileStream = File.OpenRead(fileUrl);
                    fileBytes = fileStream.GetAllBytes();
                }
                catch
                {
                    return null;
                }
                finally
                {
                    fileStream.Close();
                }
            }
            return fileBytes;
        }

        public void BytesToFile(byte[] fileBytes, string filePath)
        {
            using (FileStream fs = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.Write))
            {
                fs.Write(fileBytes, 0, fileBytes.Length);
            }
        }
    }
}