import { useEffect, useState } from 'react';
import { nhomCoService } from '../services/muscle.service';
import type { CreateNhomCoDTO, NhomCo } from '../types/muscle.type';

export const useMuscle = () => {
  const [data, setData] = useState<NhomCo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setData(await nhomCoService.getAll());
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: CreateNhomCoDTO) => {
    await nhomCoService.create(payload);
    fetchData();
  };

  const update = async (id: number, payload: Partial<CreateNhomCoDTO>) => {
    await nhomCoService.update(id, payload);
    fetchData();
  };

  const remove = async (id: number) => {
    await nhomCoService.delete(id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, create, update, remove };
};