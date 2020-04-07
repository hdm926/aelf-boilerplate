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
        public override byte[] VerifyFiles(Hash id)
        {
            var fileReceived = State.FileReceived[id]; //得到原始文件

            byte[] fileByte = null;

            if (fileReceived == null)
            {
                return fileByte;
            }

            fileByte = fileReceived.FileByte;
            Hash hashCode = Hash.FromByteArray(fileByte);
            //比较哈希码
            if (hashCode == id)
            {
                return fileByte;
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

            return new Empty();
        }

    }
}