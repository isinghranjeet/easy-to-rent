interface PGOverviewTabProps {
  description?: string;
}

export const PGOverviewTab = ({ description }: PGOverviewTabProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border">
      <h2 className="text-xl font-bold text-gray-900 mb-4">About this PG</h2>
      <p className="text-gray-700 mb-6">
        {description || 'No description available.'}
      </p>
    </div>
  );
};

