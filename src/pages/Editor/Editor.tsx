import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Code2,
  Eye,
  Clipboard,
  FileText,
  Sparkles,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHtmlParser } from "@/hooks/useHtmlParser";
import { EditorNavigation } from "./EditorNavigation";
import { useGetSingleTemplateQuery } from "./services";
import { useSearchParams } from "react-router-dom";
import { LoadingPage } from "@/components/shared/LoadingPage";
import { TemplateNotFound } from "@/components/shared/TemplateNotFound";
import { toast } from "sonner";

export function Editor() {
  const [searchParam] = useSearchParams();
  const templateId = searchParam.get("templateId");
  const { data, isLoading: gettingTemplate } = useGetSingleTemplateQuery(
    templateId as string,
    {
      skip: !templateId,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    activeTextId,
    containerVariants,
    error,
    htmlDoc,
    htmlInput,
    iframeRef,
    isLoading,
    itemVariants,
    success,
    texts,
    templateName,
    saving,
    savingSuccess,
    exportHtml,
    handlePasteFromClipboard,
    handleTextChange,
    handleTextFocus,
    reset,
    setHtmlInput,
    parseHtml,
    getDocumentStyles,
    updateTemplate,
    setTemplateName,
    htmlStringToCopy,
  } = useHtmlParser({
    template: data,
  });

  if (gettingTemplate) {
    return <LoadingPage />;
  }

  if (templateId && !data) {
    return <TemplateNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-3 py-8 w-full gap-3 flex flex-col"
      >
        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  {success}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Header */}
        {!htmlInput ? (
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg"
              >
                <Code2 className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
                HTML Live Editor
              </h1>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Paste your HTML, edit text content in real-time, and see changes
              instantly with our powerful live preview editor.
            </p>
          </motion.div>
        ) : (
          <EditorNavigation
            setTemplateName={setTemplateName}
            templateName={templateName}
            onNameChange={(value) => {
              updateTemplate({
                ...(data ?? {}),
                template: { ...(data?.template ?? {}), name: value },
              });
            }}
            reset={reset}
            saving={saving}
            savingSuccess={savingSuccess}
          />
        )}

        {/* HTML Input Section */}
        {!htmlDoc && !texts.length && (
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  <Clipboard className="w-5 h-5" />
                  HTML Input
                </CardTitle>
                <CardDescription>
                  Paste your HTML content below or use the clipboard button to
                  paste automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handlePasteFromClipboard}
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Copy className="w-4 h-4" />
                    Paste from Clipboard
                  </Button>
                  <Button
                    onClick={() => parseHtml(htmlInput)}
                    disabled={!htmlInput.trim() || isLoading}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Parse HTML
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="html-input">HTML Content</Label>
                  <Textarea
                    id="html-input"
                    placeholder="Paste your HTML content here..."
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Grid */}
        {htmlDoc && texts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text Editor Panel */}
            <motion.div variants={itemVariants}>
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-md h-fit">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Text Elements
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      {texts.length} items
                    </Badge>
                  </div>
                  <CardDescription>
                    Edit the text content of your HTML elements below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] sm:h-[600px] pr-0 sm:pr-4">
                    <div className="space-y-4">
                      {texts.map((text, index) => (
                        <motion.div
                          key={text.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <Label
                                htmlFor={text.id}
                                className="text-sm font-medium text-muted-foreground"
                              >
                                {text.label}
                              </Label>
                              <Badge variant="outline" className="text-xs">
                                #{text.id}
                              </Badge>
                            </div>
                            <Textarea
                              id={text.id}
                              value={text.value}
                              onChange={(e) =>
                                handleTextChange(text.id, e.target.value)
                              }
                              onFocus={() => handleTextFocus(text.id)}
                              className={cn(
                                "min-h-[80px] resize-none transition-all duration-200",
                                activeTextId === text.id &&
                                  "ring-2 ring-blue-500 ring-offset-2"
                              )}
                              placeholder="Enter text content..."
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Preview Panel */}
            <motion.div variants={itemVariants} className="grow">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-md h-fit">
                <CardHeader>
                  <div className="flex flex-row items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Preview
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={exportHtml}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2  w-auto"
                      >
                        <Download className="w-4 h-4" />
                        Download HTML
                      </Button>
                      <Button
                        onClick={() => {
                          const value = htmlStringToCopy();
                          navigator.clipboard.writeText(value);
                          toast("HTML copied to clipboard");
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2  w-auto"
                      >
                        <Copy className="w-4 h-4" />
                        Copy HTML
                      </Button>
                      {/* <Button
                        onClick={() => {
                          setHtmlDoc(null);
                          setTexts([]);
                          setActiveTextId(null);
                          setIsLoading(false);
                          setSuccess("");
                          setError("");
                          setHtmlInput("");
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 w-auto grow"
                      >
                        <X className="w-4 h-4" />
                        Reset
                      </Button> */}
                    </div>
                  </div>
                  <CardDescription>
                    See your changes in real-time as you edit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-3 py-2 border-b">
                      <span className="text-sm font-mono text-muted-foreground">
                        Live Preview
                      </span>
                    </div>
                    <div className="bg-white dark:bg-gray-900 min-h-[300px] sm:min-h-[545px] overflow-auto">
                      {htmlDoc && (
                        <iframe
                          ref={iframeRef}
                          srcDoc={`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                  ${getDocumentStyles()}  
                                </style>
                              </head>
                              <body>
                                ${htmlDoc.body.innerHTML}
                              </body>
                            </html>
                          `}
                          className="w-full h-[300px] sm:h-[545px] border-0"
                          title="Live Preview"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {!htmlDoc && (
          <motion.div variants={itemVariants} className="text-center py-16">
            <div className="max-w-md mx-auto px-4">
              <div className="mb-6">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Ready to Start
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Paste your HTML content above and click "Parse HTML" to begin
                  editing your text elements.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
