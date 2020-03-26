using System;
using System.IO;
using System.Linq;
using AElf.Types;
using Google.Protobuf;
using Google.Protobuf.Collections;
using Google.Protobuf.WellKnownTypes;
using Org.BouncyCastle.Crypto.Tls;

namespace AElf.Contracts.EvidenceContract
{
    public class EvidenceContract : EvidenceContractContainer.EvidenceContractBase
    {
        public override VerifyAnswer VerifyFiles(Hash id)
        {
            var fileReceived = State.FileReceived[id];//得到原始文件

            var fileName = fileReceived.FileName;//得到原始文件的文件名
            //读取服务器文件
            var filePath = "D://evidence//" + fileName;
            FileStream fs = new FileStream(filePath,FileMode.Open);

            long size = fs.Length;
            byte[] fileByte = new byte[size];

            fs.Read(fileByte, 0, fileByte.Length);
            fs.Close();
            //进行哈希计算
            Hash hashCode = Hash.FromByteArray(fileByte);
            //比较哈希码
            if (hashCode == id)
            {
                var verifyAnswer = State.VerifyAnswer[id];
                verifyAnswer.IsSame = true;
                verifyAnswer.FileAnswer = ByteString.CopyFrom(fileByte);
                return State.VerifyAnswer[id];
            }

            return null;
        }

        public override Empty FilesToHash(FileReceived input)
        {
            //fileReceived: id,fileName,fileBytes,fileSize,saveTime
            Hash id = input.Id;
            var fileReveived = State.FileReceived[id];

            fileReveived.FileName = input.FileName;
            fileReveived.FileSize = input.FileSize;
            fileReveived.SaveTime = Timestamp.FromDateTime(DateTime.Now);

            //byte数组写入文件
            var filePath = "D:\\evidence";
            BytesToFile(input.FileByte.ToByteArray(), filePath, fileReveived.FileName);

            return new Empty();
        }

        private void BytesToFile(byte[] fileBytes, string filePath, string fileName)
        {
            string path = filePath + fileName;
            FileStream fs = new FileStream(path, FileMode.Create);

            fs.Write(fileBytes, 0, fileBytes.Length);
            fs.Close();
        }

    }
}