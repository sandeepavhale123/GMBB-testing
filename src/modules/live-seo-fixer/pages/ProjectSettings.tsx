import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  ArrowLeft,
  AlertTriangle,
  Trash2,
  Globe,
  Shield,
  CheckCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Project } from "../types/Project";
import { useToast } from "@/hooks/use-toast";
import {
  generateWordPressApiKey,
  testWordPressConnection,
  connectWordPress,
  disconnectWordPress,
} from "@/services/liveSeoFixer/wordpressService";
import { getProjectDetails } from "@/services/liveSeoFixer/projectService";

const ProjectSettings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = React.useState<any>(null);
  const [isLoadingProject, setIsLoadingProject] = React.useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // WordPress integration state
  const [wordpressUrl, setWordpressUrl] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = React.useState(false);

  // Fetch project data on mount
  React.useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;

      setIsLoadingProject(true);
      try {
        const response = await getProjectDetails(projectId);
        const projectData = response.data;

        setProject(projectData);

        // Handle WordPress connection data
        const wpConn = projectData.wordpress_connection;
        if (wpConn) {
          if (wpConn.connected && wpConn.wordpress_url) {
            setWordpressUrl(wpConn.wordpress_url);
          }

          // Auto-generate API key if not present
          if (!wpConn.api_key) {
            handleGenerateApiKey();
          } else {
            setApiKey(wpConn.api_key);
          }
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProject(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleSave = () => {
    // Mock save success
    alert("Project settings saved successfully!");
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      // Mock delete
      navigate("/module/live-seo-fixer/dashboard");
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!projectId) return;

    setIsGeneratingKey(true);
    try {
      const response = await generateWordPressApiKey(projectId);
      setApiKey(response.api_key);
      toast({
        title: "API Key Generated",
        description: "Copy this key to your WordPress plugin settings.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to generate API key.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const handleTestConnection = async () => {
    if (!projectId || !wordpressUrl || !apiKey) return;

    setIsConnecting(true);
    try {
      const testResponse = await testWordPressConnection(
        projectId,
        wordpressUrl,
        apiKey
      );

      // If test succeeds, save the connection
      await connectWordPress(projectId, wordpressUrl, apiKey);

      setProject((prev) => ({
        ...prev,
        wordpress_connection: {
          connected: true,
          api_key: apiKey,
          wordpress_url: wordpressUrl,
          last_sync: null,
          total_fixes_synced: 0,
          sync_status: "success" as const,
          errors: [],
        },
      }));

      toast({
        title: "WordPress Connected",
        description: `Successfully connected to ${testResponse.site_name}`,
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description:
          error.response?.data?.message ||
          "Failed to connect to WordPress. Please check your URL and API key.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!projectId) return;

    // Get API key from project data or local state
    const keyToUse = project?.wordpress_connection?.api_key || apiKey;

    if (!keyToUse) {
      toast({
        title: "Error",
        description: "API key not found. Cannot disconnect.",
        variant: "destructive",
      });
      return;
    }

    try {
      await disconnectWordPress(projectId, keyToUse);

      setProject((prev) => ({
        ...prev,
        wordpress_connection: {
          connected: false,
          api_key: undefined,
          wordpress_url: undefined,
          last_sync: null,
          total_fixes_synced: 0,
          sync_status: null,
          errors: [],
        },
      }));

      setWordpressUrl("");

      toast({
        title: "WordPress Disconnected",
        description:
          "Your WordPress connection has been removed. You can use the same API key to reconnect.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to disconnect WordPress.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoadingProject || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading project settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(`/module/live-seo-fixer/projects/${projectId}`)
          }
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Project Settings
            </h1>
            <Badge className={`${getStatusColor(project.status)} capitalize`}>
              {project.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project.name}</p>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update the basic details of your project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={project.name}
                onChange={(e) =>
                  setProject((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={project.website}
                onChange={(e) =>
                  setProject((prev) => ({ ...prev, website: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                value={project.address || ""}
                onChange={(e) =>
                  setProject((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="123 Main St, City, State 12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={project.phone || ""}
                onChange={(e) =>
                  setProject((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={project.description || ""}
              onChange={(e) =>
                setProject((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Brief description of your website..."
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select
              value={project.status}
              onValueChange={(value: Project["status"]) =>
                setProject((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Automation Settings
          </CardTitle>
          <CardDescription>
            Configure how the system handles audits and fixes automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Audit Frequency</Label>
            <Select
              value={project.auditFrequency}
              onValueChange={(value) =>
                setProject((prev) => ({ ...prev, auditFrequency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How often to automatically run SEO audits on your pages
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Apply Fixes</Label>
              <p className="text-sm text-muted-foreground">
                Automatically apply approved fixes without manual review
              </p>
            </div>
            <Switch
              checked={project.autoFix}
              onCheckedChange={(checked) =>
                setProject((prev) => ({ ...prev, autoFix: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about audit results and fixes
              </p>
            </div>
            <Switch
              checked={project.notifications}
              onCheckedChange={(checked) =>
                setProject((prev) => ({ ...prev, notifications: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* WordPress Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            WordPress Integration
          </CardTitle>
          <CardDescription>
            Connect your WordPress site to apply SEO fixes server-side for
            better performance and reliability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!project.wordpress_connection?.connected ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="wordpress-url">WordPress Site URL</Label>
                <Input
                  id="wordpress-url"
                  placeholder="https://yoursite.com"
                  value={wordpressUrl}
                  onChange={(e) => setWordpressUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Setup Instructions</Label>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 bg-muted p-4 rounded-md">
                  <li>
                    Install the "SEO Fixer Connector" plugin on your WordPress
                    site
                  </li>
                  <li>
                    Click "Generate API Key" below to create a secure connection
                    key
                  </li>
                  <li>
                    Copy the API key and paste it in your WordPress plugin
                    settings
                  </li>
                  <li>Click "Test & Connect" to verify the connection</li>
                </ol>
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateApiKey}
                    disabled={isGeneratingKey}
                  >
                    {isGeneratingKey ? "Generating..." : "Generate API Key"}
                  </Button>
                  {apiKey && (
                    <>
                      <Input
                        value={apiKey}
                        readOnly
                        className="font-mono text-sm flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyApiKey}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Button
                onClick={handleTestConnection}
                disabled={!wordpressUrl || !apiKey || isConnecting}
                className="w-full"
              >
                {isConnecting ? "Connecting..." : "Test & Connect"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">
                    Connected to WordPress
                  </p>
                  <p className="text-sm text-green-700">
                    {project.wordpress_connection.wordpress_url}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Last Sync</p>
                  <p className="font-medium">
                    {project.wordpress_connection.last_sync
                      ? new Date(
                          project.wordpress_connection.last_sync
                        ).toLocaleString()
                      : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fixes Synced</p>
                  <p className="font-medium">
                    {project.wordpress_connection.total_fixes_synced || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      project.wordpress_connection.sync_status === "success"
                        ? "bg-green-100 text-green-800"
                        : project.wordpress_connection.sync_status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {project.wordpress_connection.sync_status || "pending"}
                  </Badge>
                </div>
              </div>

              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Server-side rendering:</strong> Your approved fixes
                  will be automatically synced to WordPress and applied before
                  pages are sent to browsers and crawlers.
                </p>
              </div>

              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="w-full"
              >
                Disconnect WordPress
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions for this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-900">Delete Project</h4>
              <p className="text-sm text-red-700">
                Once you delete a project, there is no going back. All data,
                audits, and fixes will be permanently removed.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="ml-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {showDeleteConfirm ? "Confirm Delete" : "Delete Project"}
            </Button>
          </div>
          {showDeleteConfirm && (
            <p className="text-sm text-red-600 mt-2 font-medium">
              Click "Confirm Delete" again within 5 seconds to permanently
              delete this project.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="min-w-32">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProjectSettings;
