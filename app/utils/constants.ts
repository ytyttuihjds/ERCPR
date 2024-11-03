import type { ModelInfo, OllamaApiResponse, OllamaModel } from './types';

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';
export const MODEL_REGEX = /^\[Model: (.*?)\]\n\n/;
export const DEFAULT_MODEL = 'gemini-1.5-flash-latest';
export const DEFAULT_PROVIDER = 'Google';

const staticModels: ModelInfo[] = [
  { name: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash', provider: 'Google' },
  { name: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro', provider: 'Google'},
  { name: 'anthropic/claude-3-haiku', label: 'Anthropic: Claude 3 Haiku (OpenRouter)', provider: 'OpenRouter' },
  { name: 'deepseek/deepseek-coder', label: 'Deepseek-Coder V2 236B (OpenRouter)', provider: 'OpenRouter' },
  { name: 'google/gemini-flash-1.5', label: 'Google Gemini Flash 1.5 (OpenRouter)', provider: 'OpenRouter' },
  { name: 'google/gemini-pro-1.5', label: 'Google Gemini Pro 1.5 (OpenRouter)', provider: 'OpenRouter' },
  { name: 'mistralai/mistral-nemo', label: 'OpenRouter Mistral Nemo (OpenRouter)', provider: 'OpenRouter' },
  { name: 'qwen/qwen-110b-chat', label: 'OpenRouter Qwen 110b Chat (OpenRouter)', provider: 'OpenRouter' },
  { name: 'cohere/command', label: 'Cohere Command (OpenRouter)', provider: 'OpenRouter' },
];

export let MODEL_LIST: ModelInfo[] = [...staticModels];

async function getOllamaModels(): Promise<ModelInfo[]> {
  try {
    const base_url = import.meta.env.OLLAMA_API_BASE_URL || "http://localhost:11434";
    const response = await fetch(`${base_url}/api/tags`);
    const data = await response.json() as OllamaApiResponse;

    return data.models.map((model: OllamaModel) => ({
      name: model.name,
      label: `${model.name} (${model.details.parameter_size})`,
      provider: 'Ollama',
    }));
  } catch (e) {
    return [];
  }
}


async function initializeModelList(): Promise<void> {
  // Remove Ollama and OpenAI models from MODEL_LIST
  MODEL_LIST = [...staticModels];
}
initializeModelList().then();
export { getOllamaModels, initializeModelList };