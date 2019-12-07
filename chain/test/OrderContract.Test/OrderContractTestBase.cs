using System.IO;
using System.Linq;
using Acs0;
using AElf;
using AElf.Contracts.OrderContract;
using AElf.Contracts.TestKit;
using AElf.Cryptography.ECDSA;
using AElf.Kernel;
using AElf.Types;
using Google.Protobuf;
using Volo.Abp.Threading;

namespace OrderContract.Test
{
    public class OrderContractTestBase : ContractTestBase<OrderContractTestModule>
    {
        internal OrderContractContainer.OrderContractStub OrderContractStub { get; set; }
        private ACS0Container.ACS0Stub ZeroContractStub { get; set; }

        private Address OrderContractAddress { get; set; }

        protected OrderContractTestBase()
        {
            InitializeContracts();
        }

        private void InitializeContracts()
        {
            ZeroContractStub = GetZeroContractStub(SampleECKeyPairs.KeyPairs.First());

            OrderContractAddress = AsyncHelper.RunSync(() =>
                ZeroContractStub.DeploySystemSmartContract.SendAsync(
                    new SystemContractDeploymentInput
                    {
                        Category = KernelConstants.CodeCoverageRunnerCategory,
                        Code = ByteString.CopyFrom(File.ReadAllBytes(typeof(AElf.Contracts.OrderContract.OrderContract).Assembly.Location)),
                        Name = ProfitSmartContractAddressNameProvider.Name,
                        TransactionMethodCallList =
                            new SystemContractDeploymentInput.Types.SystemTransactionMethodCallList()
                    })).Output;
            OrderContractStub = GetOrderContractStub(SampleECKeyPairs.KeyPairs.First());
        }

        private ACS0Container.ACS0Stub GetZeroContractStub(ECKeyPair keyPair)
        {
            return GetTester<ACS0Container.ACS0Stub>(ContractZeroAddress, keyPair);
        }

        private OrderContractContainer.OrderContractStub GetOrderContractStub(ECKeyPair keyPair)
        {
            return GetTester<OrderContractContainer.OrderContractStub>(OrderContractAddress, keyPair);
        }    }
}