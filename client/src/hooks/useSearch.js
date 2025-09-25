import { useMutation } from '@tanstack/react-query'
import { searchLlama } from '../api/llama'

export function useSearch() {
  return useMutation({
    mutationFn: searchLlama,
  })
}