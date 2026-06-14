type ReportPageProps = {
  params: {
    id: string;
  };
};

export default function ReportPage({ params }: ReportPageProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Report</h1>
      <p className="text-muted-foreground">
        Report view and PDF export for project ID: {params.id}
      </p>
    </div>
  );
}
