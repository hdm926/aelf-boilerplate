using System;
using System.Diagnostics.CodeAnalysis;
using AElf.Types;
using Google.Protobuf.WellKnownTypes;

namespace AElf.Contracts.EvidenceContract
{
    public class EvidenceContract : EvidenceContractContainer.EvidenceContractBase
    {
        public override BytesValue VerifyFiles(Hash id)
        {
            var fileReceived = State.FileReceived[id]; //得到原始文件

            if (fileReceived == null)
            {
                return null;
            }

            var fileByte = fileReceived.FileByte;
            Hash hashCode = Hash.FromByteArray(fileByte.ToByteArray());
            //比较哈希码
            if (hashCode == id)
            {
                return new BytesValue {Value = fileByte};
            }

            return null;
        }

        public override Empty FilesToHash(FileReceived input)
        {
            //fileReceived: id,fileName,fileBytes,fileSize,saveTime
            Hash id = input.Id;
            var fileReveived = new FileReceived
            {
                Id = id,
                FileByte = input.FileByte,
                FileName = input.FileName,
                FileSize = input.FileSize,
                SaveTime = Timestamp.FromDateTime(DateTime.Now)
            };
            State.FileReceived[id] = fileReveived;

            return new Empty();
        }

    }
}