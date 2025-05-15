import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { KeyRound, PlusCircle, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";

interface ApiKey {
  id: string;
  provider: 'openai' | 'anthropic' | 'deepseek' | 'other';
  name: string;
  key: string;
  addedDate: string;
}

const ApiKeysPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', provider: 'openai', name: '默认OpenAI Key', key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxSAMPLE', addedDate: '2024-01-15' },
    { id: '2', provider: 'anthropic', name: 'Claude Opus Key', key: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxSAMPLE', addedDate: '2024-03-01' },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [keyFormData, setKeyFormData] = useState<{ provider: ApiKey['provider']; name: string; key: string }>({
    provider: 'openai',
    name: '',
    key: '',
  });
  const [showKeyId, setShowKeyId] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKeyFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setKeyFormData(prev => ({ ...prev, [name]: value as ApiKey['provider'] }));
  };

  const handleSubmit = () => {
    if (!keyFormData.name || !keyFormData.key || !keyFormData.provider) {
      toast.error("请填写所有必填项！");
      return;
    }
    if (editingKey) {
      setApiKeys(apiKeys.map(k => k.id === editingKey.id ? { ...editingKey, ...keyFormData } : k));
      toast.success(`API密钥 "${keyFormData.name}" 已更新。`);
    } else {
      const newKey: ApiKey = {
        id: String(Date.now()),
        ...keyFormData,
        addedDate: new Date().toISOString().split('T')[0],
      };
      setApiKeys([...apiKeys, newKey]);
      toast.success(`API密钥 "${keyFormData.name}" 已添加。`);
    }
    setIsFormOpen(false);
    setEditingKey(null);
    setKeyFormData({ provider: 'openai', name: '', key: '' });
  };

  const handleEdit = (key: ApiKey) => {
    setEditingKey(key);
    setKeyFormData({ provider: key.provider, name: key.name, key: key.key });
    setIsFormOpen(true);
  };

  const handleDelete = (keyId: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== keyId));
    toast.success("API密钥已删除。");
  };
  
  const toggleShowKey = (keyId: string) => {
    setShowKeyId(prev => prev === keyId ? null : keyId);
  };

  const providerDisplayNames: Record<ApiKey['provider'], string> = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    deepseek: 'DeepSeek',
    other: '其他',
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <KeyRound size={28} className="mr-3 text-primary-dark" />
          <h1 className="text-2xl font-semibold text-text-primary-html">API密钥管理</h1>
        </div>
        <Button onClick={() => { setEditingKey(null); setKeyFormData({ provider: 'openai', name: '', key: '' }); setIsFormOpen(true); }}>
          <PlusCircle size={16} className="mr-2" /> 添加API密钥
        </Button>
      </div>
      <p className="text-text-secondary-html mb-6">
        在此处管理您用于访问大模型服务提供商的API密钥。请妥善保管您的密钥。
      </p>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[150px]">服务商</TableHead>
              <TableHead>名称/别名</TableHead>
              <TableHead>API密钥 (点击显示/隐藏)</TableHead>
              <TableHead className="w-[150px]">添加日期</TableHead>
              <TableHead className="text-right w-[120px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-8">暂无API密钥</TableCell></TableRow>
            )}
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="font-medium">{providerDisplayNames[apiKey.provider]}</TableCell>
                <TableCell>{apiKey.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span>{showKeyId === apiKey.id ? apiKey.key : `${apiKey.key.substring(0, 6)}...${apiKey.key.substring(apiKey.key.length - 4)}`}</span>
                    <Button variant="ghost" size="icon" className="ml-2 h-6 w-6" onClick={() => toggleShowKey(apiKey.id)}>
                      {showKeyId === apiKey.id ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{apiKey.addedDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-1 hover:text-primary-dark" onClick={() => handleEdit(apiKey)}>
                    <Edit size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除?</AlertDialogTitle>
                        <AlertDialogDescription>
                          您确定要删除API密钥 "{apiKey.name}" ({providerDisplayNames[apiKey.provider]}) 吗？此操作无法撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(apiKey.id)} className="bg-destructive hover:bg-destructive/90">删除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        setIsFormOpen(isOpen);
        if (!isOpen) setEditingKey(null);
      }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingKey ? '编辑API密钥' : '添加新的API密钥'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="provider" className="text-sm font-medium">服务商</Label>
              <Select value={keyFormData.provider} onValueChange={(value) => handleSelectChange('provider', value)}>
                <SelectTrigger id="provider" className="mt-1">
                  <SelectValue placeholder="选择服务商" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="deepseek">DeepSeek</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name" className="text-sm font-medium">名称/别名</Label>
              <Input id="name" name="name" value={keyFormData.name} onChange={handleInputChange} className="mt-1" placeholder="例如：我的主力OpenAI Key"/>
            </div>
            <div>
              <Label htmlFor="key" className="text-sm font-medium">API密钥</Label>
              <Input id="key" name="key" type="password" value={keyFormData.key} onChange={handleInputChange} className="mt-1" placeholder="请输入API密钥"/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">取消</Button></DialogClose>
            <Button onClick={handleSubmit}>{editingKey ? '保存更改' : '添加密钥'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeysPage;