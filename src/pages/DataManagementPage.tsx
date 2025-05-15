import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, CheckCircle, Trash2, Upload, Search as SearchIcon, Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Restore Dialog imports
// import { Label } from '@/components/ui/label'; // Keep others commented for now
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
import DataStatisticsCard from '@/components/DataStatisticsCard'; // Restore
import DataProcessingHistoryCard from '@/components/DataProcessingHistoryCard'; // Restore

// Mock data for the table, replace with actual data fetching later
const mockSeedData = [
  { id: '1', name: 'example_seed_data.jsonl', records: 1000, size: '2.5 MB', status: '已校验', statusType: 'success', uploadDate: '2024-05-10' },
  { id: '2', name: 'code_examples.jsonl', records: 500, size: '1.8 MB', status: '已校验', statusType: 'success', uploadDate: '2024-05-09' },
  { id: '3', name: 'raw_conversations.csv', records: 1200, size: '3.2 MB', status: '待校验', statusType: 'warning', uploadDate: '2024-05-07' },
  { id: '4', name: 'new_dataset_to_validate.jsonl', records: 750, size: '1.2 MB', status: '新上传', statusType: 'info', uploadDate: '2024-05-14' },
];

type SeedDataItem = typeof mockSeedData[0];

const DataManagementPage: React.FC = () => {
  const [seedData, setSeedData] = useState<SeedDataItem[]>(mockSeedData); // Restore seedData state
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // Restore for Upload button, though modal itself is later
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // Restore
  const [previewFileName, setPreviewFileName] = useState(''); // Restore
  const [previewFileContent, setPreviewFileContent] = useState(''); // Restore

  // TODO: Implement actual file upload, preview, delete, validate logic

  const handleShowPreview = (fileName: string) => { // Restore
    setPreviewFileName(fileName);
    // Simulate fetching content based on fileName
    if (fileName === 'example_seed_data.jsonl') {
        setPreviewFileContent(
`[
  {
    "instruction": "解释量子计算中的叠加态概念",
    "response": "在量子计算中，叠加态是指量子比特可以同时处于多个状态的能力。传统计算机的比特只能是0或1，而量子比特可以同时是0和1的线性组合，直到被测量时才会坍缩为特定状态。这种特性使量子计算机能够并行处理大量可能的解决方案，为特定类型的计算提供巨大的速度提升。"
  },
  {
    "instruction": "如何实现简单的Web服务器？",
    "response": "使用Python实现简单的Web服务器可以通过内置的http.server模块：\\n\\n\`\`\`python\\nimport http.server\\nimport socketserver\\n\\nPORT = 8000\\nHandler = http.server.SimpleHTTPRequestHandler\\n\\nwith socketserver.TCPServer(("", PORT), Handler) as httpd:\\n    print("服务器运行在端口:", PORT)\\n    httpd.serve_forever()\\n\`\`\`\\n\\n运行这段代码后，可以在浏览器中访问http://localhost:8000来查看当前目录中的文件。"
  }
]`
        );
    } else {
        setPreviewFileContent(`无法预览文件: ${fileName} (此为模拟预览)`);
    }
    setIsPreviewModalOpen(true);
  };

  const handleDeleteItem = (id: string) => { // Restore
    setSeedData((prevData: SeedDataItem[]) => prevData.filter((item: SeedDataItem) => item.id !== id));
    // TODO: API call to delete on backend
  };
  
  const filteredData = seedData.filter((item: SeedDataItem) => // Restore filteredData
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusTagClass = (statusType: string) => { // Restore getStatusTagClass
    switch (statusType) {
      case 'success': return 'bg-success-html/10 text-green-700';
      case 'warning': return 'bg-warning-html/10 text-yellow-700';
      case 'info': return 'bg-info-html/10 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Mock data for chart - Restore this logic
  const chartData = {
    labels: ['通用问答', '代码', '对话'],
    values: [
      seedData.filter((d: SeedDataItem) => d.name.includes('seed_data') || d.name.includes('conversations')).reduce((sum: number, item: SeedDataItem) => sum + item.records, 0),
      seedData.filter((d: SeedDataItem) => d.name.includes('code_examples')).reduce((sum: number, item: SeedDataItem) => sum + item.records, 0),
      seedData.filter((d: SeedDataItem) => d.name.includes('new_dataset')).reduce((sum: number, item: SeedDataItem) => sum + item.records, 0) // Example, adjust as needed
    ].filter((v: number) => v > 0) // Filter out zero values if any category is empty
  };
  // Adjust labels if some values are filtered out
  const activeLabels = chartData.labels.filter((_, index: number) => chartData.values[index] > 0);


  // Calculate total records and size for statistics - Restore this logic
  const totalRecords = seedData.reduce((sum: number, item: SeedDataItem) => sum + item.records, 0);
  // Assuming size is like "2.5 MB", "1.8 MB". This is a simplified sum.
  const totalSizeMB = seedData.reduce((sum: number, item: SeedDataItem) => {
    const sizeMatch = item.size.match(/(\d+(\.\d+)?)\s*MB/);
    return sum + (sizeMatch ? parseFloat(sizeMatch[1]) : 0);
  }, 0);
  const totalSizeDisplay = totalSizeMB > 0 ? `${totalSizeMB.toFixed(1)} MB` : "N/A";

  return (
    <div className="space-y-6">
      {/* Seed Data Management Card */}
      <div className="bg-bg-card-html rounded-xl shadow-sm-html">
        <div className="px-6 py-5 border-b border-black/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-text-primary-html flex items-center">
            <Database size={22} className="mr-3 text-primary-dark" />
            种子数据管理 (Restored Basic Structure)
          </h2>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary-html" />
              <Input
                type="text"
                placeholder="搜索数据..."
                className="pl-9 text-sm py-2"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="sm" className="text-xs" onClick={() => alert('Upload modal disabled for now')}>
              <Upload size={14} className="mr-1.5" /> 上传数据
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full align-middle">
            {/* Data Header */}
            <div className="grid grid-cols-[minmax(200px,3fr)_repeat(5,minmax(80px,1fr))] gap-4 px-6 py-3 bg-slate-50 text-xs font-medium text-text-primary-html border-b border-black/5">
              <div>文件名</div>
              <div className="hidden sm:block text-center">记录数</div>
              <div className="hidden sm:block text-center">大小</div>
              <div className="text-center">状态</div>
              <div className="hidden md:block text-center">上传日期</div>
              <div className="text-right">操作</div>
            </div>
            {/* Data List Container - Restore list rendering */}
            <div className="bg-white">
              {filteredData.map((item: SeedDataItem) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(200px,3fr)_repeat(5,minmax(80px,1fr))] gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-b-0 hover:bg-primary-dark/5 transition-colors duration-150 text-sm"
                >
                  <div className="text-text-primary-html font-medium truncate" title={item.name}>{item.name}</div>
                  <div className="hidden sm:block text-center text-text-secondary-html">{item.records.toLocaleString()}</div>
                  <div className="hidden sm:block text-center text-text-secondary-html">{item.size}</div>
                  <div className="text-center">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusTagClass(item.statusType)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="hidden md:block text-center text-text-secondary-html">{item.uploadDate}</div>
                  <div className="flex justify-end space-x-1">
                    {/* Restore original button logic */}
                    <Button variant="ghost" size="xs" title="预览" onClick={() => handleShowPreview(item.name)}>
                      <Eye className="h-4 w-4 text-text-secondary-html hover:text-primary-dark" />
                    </Button>
                    <Button variant="ghost" size="xs" title="校验" onClick={() => alert('Validate action to be implemented')}>
                      <CheckCircle className="h-4 w-4 text-text-secondary-html hover:text-success-html" />
                    </Button>
                    <Button variant="ghost" size="xs" title="删除" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-text-secondary-html hover:text-danger-html" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredData.length === 0 && (
                <div className="px-6 py-10 text-center text-text-secondary-html">没有找到匹配的数据。</div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination (Simplified) */}
        <div className="px-6 py-4 border-t border-black/5 flex justify-between items-center text-xs text-text-secondary-html">
          <div>显示 {filteredData.length > 0 ? 1 : 0}-{filteredData.length} 条，共 {filteredData.length} 条</div>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" className="text-xs" disabled={true}>上一页</Button>
            <Button variant="outline" size="sm" className="text-xs" disabled={true}>下一页</Button>
          </div>
        </div>
      </div>

      {/* Grid for Statistics and History - Restore DataStatisticsCard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataStatisticsCard
          totalRecords={totalRecords}
          totalSize={totalSizeDisplay}
          fileCount={seedData.length}
          distributionData={{ labels: activeLabels, values: chartData.values }}
        />
        <DataProcessingHistoryCard />
      </div>

      {/* Seed Data Preview Modal - Restore this modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>数据预览: {previewFileName}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto p-1 bg-slate-900 rounded-md">
            <pre className="text-xs text-slate-200 whitespace-pre-wrap break-all p-4 font-mono">
              {previewFileContent}
            </pre>
          </div>
          <DialogFooter className="mt-auto pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">关闭</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Upload modal remains commented out for now */}
      {/* <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}> ... </Dialog> */}
      <p className="text-center text-sm text-gray-500 mt-4">预览弹窗已启用，上传弹窗仍禁用。</p>
    </div>
  );
};

export default DataManagementPage;