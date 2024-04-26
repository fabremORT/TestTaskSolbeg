
namespace TestTaskSolbeg.Entities.Interfaces
{
    public interface IRepository<T>
    {
        T Get(int id);
        IEnumerable<T> GetAll();
        void Create(T entity);
        void Edit(T entity);
        void Delete(IEnumerable<int> entitiesIds);
    }
}
