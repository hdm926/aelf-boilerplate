using AElf.Sdk.CSharp.State;
using AElf.Types;

namespace AElf.Contracts.EvidenceContract
{
    public class EvidenceContractState : ContractState
    {
        public MappedState<Hash, FileReceived> FileReceived { get; set; }
        public MappedState<Hash, VerifyAnswer> VerifyAnswer { get; set; }
    }
}