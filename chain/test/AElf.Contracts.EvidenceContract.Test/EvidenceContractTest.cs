using System.Threading.Tasks;
using AElf.Types;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using Shouldly;
using Xunit;

namespace AElf.Contracts.EvidenceContract
{
    public class EvidenceContractTest : EvidenceContractTestBase
    {
        [Fact]
        public async Task FilesToHashCall_ReturnsHashMessage()
        {
            var txResult = await EvidenceContractStub.FilesToHash.SendAsync(new FileReceived());
            txResult.TransactionResult.Status.ShouldBe(TransactionResultStatus.Mined);
            var text = new Empty();
            text.MergeFrom(txResult.TransactionResult.ReturnValue);
            text.ShouldNotBeNull();
        }
        
        [Fact]
        public async Task VerifyFilesCall_ReturnsBytesValueMessage()
        {
            var txResult = await EvidenceContractStub.VerifyFiles.SendAsync(new Hash());
            txResult.TransactionResult.Status.ShouldBe(TransactionResultStatus.Mined);
            var text = new BytesValue();
            text.MergeFrom(txResult.TransactionResult.ReturnValue);
            text.ShouldNotBeNull();
        }
    }
}