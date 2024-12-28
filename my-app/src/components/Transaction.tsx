import TransactionTable from './TransactionTable';

type Props = {};

const Transaction = (props: Props) => {
  return (
    <div>
      <div className="text-center my-12 font-bold text-4xl ">
        Transaction Information
      </div>
      <TransactionTable />
    </div>
  );
};

export default Transaction;
