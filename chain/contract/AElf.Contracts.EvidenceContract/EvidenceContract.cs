using System;
using System.Diagnostics.CodeAnalysis;
using AElf.Types;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;

namespace AElf.Contracts.EvidenceContract
{
    public class EvidenceContract : EvidenceContractContainer.EvidenceContractBase
    {
        //验证方案一
        public override BytesValue VerifyFiles(Hash id)
        {
            var fileReceived = State.FileReceived[id]; //得到原始文件
           // Assert(fileReceived==null,"The hash code input is wrong.");
           
           if (fileReceived != null)
            {
                var fileByte = fileReceived.FileByte;
                return new BytesValue {Value = fileByte};
            }
            return null;
        }

        //验证方案二
        public override StringValue VerifyFilesPlanB(VerifyPlanB verifyPlanB)
        {
            var fileReceivedPlanB = State.FileReceivedPlanB[verifyPlanB.HashInput];
            if (fileReceivedPlanB == null)
            {
                return new StringValue{Value = "文件标识码有误"};
            }

            if (fileReceivedPlanB.Id.Equals(verifyPlanB.HashFromFile))
            {
                return new StringValue{Value = "哈希一致"};
            }
            else
            {
                return new StringValue{Value = "哈希不一致"};
            }
            
        }
        
        //存证方案一：存储图片信息，系统压力较大
        public override Hash FilesToHash(FileReceived input)
        {
            //fileReceived: id,fileName,fileBytes,fileSize,saveTime
            Hash id = input.Id;

            var fileReveived = new FileReceived
            {
                Id = id,
                FileByte = input.FileByte,
                FileName = input.FileName,
                FileSize = input.FileSize,
            };
            State.FileReceived[id] = fileReveived;

            return id;
        }
        
        //存证方案二，只存哈希
        public override Hash FilesToHashPlanB(FileReceivedPlanB input)
        {
            Hash id = input.Id;
            var fileReveivedPlanB = new FileReceivedPlanB
            {
                Id = id,
                FileName = input.FileName,
                FileSize = input.FileSize,
            };
            State.FileReceivedPlanB[id] = fileReveivedPlanB;
            return id;
        }
        
        //查询文件是否存在
        public override StringValue FileExistOrNot(Hash input)
        {
            var file1 = State.FileReceived[input];
            var file2 = State.FileReceivedPlanB[input];
            if (file1 == null & file2 == null)
            {
                return new StringValue{Value = "not exist"};
            }
            else
            {
                return new StringValue{Value = "exist"};
            }
        }
    }
}