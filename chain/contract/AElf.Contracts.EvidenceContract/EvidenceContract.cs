using System;
using System.Diagnostics.CodeAnalysis;
using AElf.Types;
using Google.Protobuf.WellKnownTypes;

namespace AElf.Contracts.EvidenceContract
{
    public class EvidenceContract : EvidenceContractContainer.EvidenceContractBase
    {
        public override BytesValue VerifyFiles(StringValue id)
        {
            Hash hashCode = Hash.FromString(id.Value);
            var fileReceived = State.FileReceived[hashCode]; //得到原始文件
            Assert(fileReceived==null,"The hash code input is wrong.");

            if (fileReceived != null)
            {
                var fileByte = fileReceived.FileByte;
                return new BytesValue {Value = fileByte};
            }
            return null;
        }

        public override StringValue VerifyFilesPlanB(VerifyPlanB verifyPlanB)
        {
            var id = verifyPlanB.HashInput;
            var hashInput = Hash.FromString(id);
            var fileReceivedPlanB = State.FileReceivedPlanB[hashInput];
            Assert(fileReceivedPlanB==null,"The hash code input is wrong.");
            if (verifyPlanB.HashFromFile == hashInput)
            {
                return new StringValue{Value = "哈希一致"};
            }
            else
            {
                return new StringValue{Value = "哈希不一致"};
            }
            
        }

        public override Hash FilesToHash(FileReceived input)
        {//存储图片信息的接口，系统压力较大
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

        public override Hash FilesToHashPlanB(FileReceivedPlanB input)
        {//只存储图片哈希值的接口
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
    }
}