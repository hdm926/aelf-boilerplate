using AElf.Contracts.TestKit;
using AElf.Kernel.SmartContract;
using Volo.Abp.Modularity;

namespace AElf.Contracts.HelloWorldContract
{
    [DependsOn(typeof(ContractTestModule))]
    public class HelloWorldContractTestModule : ContractTestModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<ContractOptions>(o => o.ContractDeploymentAuthorityRequired = false);
        }
    }
}